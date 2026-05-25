
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type {Round, Output, ModelKey, ModeKey, Id, LayoutKey} from './types'
import {get, set} from './store'
import modes, {layouts} from './modes'
import {generateImage, generateSeoMetadata} from './llm'
import models from './models'
import {keys, entries, values, fromEntries} from './utils'

export const init = () => {
  if (get().didInit) {
    return
  }

  set(state => {
    state.didInit = true

    if (state?.userRounds?.length) {
      state.userRounds = state.userRounds.flatMap(round => {
        const prunedOutputs = (Object.entries(round.outputs) as [string, Output][]).filter(
          ([, output]) => output.state === 'success'
        )

        return prunedOutputs.length
          ? {
              ...round,
              outputs: Object.fromEntries(prunedOutputs)
            }
          : []
      })
    }
  })
}

const newOutput = (model: ModelKey, mode: ModeKey): Output => ({
  model,
  mode,
  id: crypto.randomUUID(),
  srcCode: '',
  state: 'loading',
  startTime: Date.now(),
  totalTime: 0
})

export const addRound = async (
  prompt: string,
  inputImage: string | null,
  options?: {
    outputMode?: ModeKey
    activeLayout?: LayoutKey
    batchMode?: boolean
    batchSize?: number
    batchModel?: ModelKey
    versusModels?: {[key in ModelKey]?: boolean}
  }
) => {
  const state = get()

  // Use provided options or fall back to current state
  const outputMode = options?.outputMode ?? state.outputMode
  const activeLayout = options?.activeLayout ?? state.activeLayout
  const batchMode = options?.batchMode ?? state.batchMode
  const batchSize = options?.batchSize ?? state.batchSize
  const batchModel = options?.batchModel ?? state.batchModel
  const versusModels = options?.versusModels ?? state.versusModels

  scrollTo({top: 0, left: 0, behavior: 'smooth'})

  if (!batchMode && values(versusModels).every(active => !active)) {
    return
  }

  const systemInstruction = modes[outputMode].systemInstruction
  const layoutInstruction = layouts[activeLayout]?.promptSuffix || ''
  
  // Combine prompt and layout into a cohesive description
  const fullPrompt = `${prompt}. ${layoutInstruction}`

  const newRound: Round = {
    prompt, // Store original user prompt
    inputImage,
    id: crypto.randomUUID(),
    mode: outputMode,
    layout: activeLayout,
    systemInstructions: systemInstruction,
    createdAt: Date.now(),
    createdBy: 'anonymous',
    outputs: fromEntries(
      batchMode
        ? Array(batchSize)
            .fill(null)
            .map(() => {
              const output = newOutput(batchModel, outputMode)
              return [output.id, output]
            })
        : (Object.entries(versusModels) as [ModelKey, boolean][])
            .filter(([, active]) => active)
            .map(([model]) => {
              const output = newOutput(model, outputMode)
              return [output.id, output]
            })
    )
  }

  // Add round immediately
  set(state => {
    state.userRounds.unshift(newRound)
  })
  
  // Trigger SEO Generation concurrently
  generateSeoMetadata(fullPrompt).then(metadata => {
     set(state => {
        const round = state.feed.find(r => r.id === newRound.id)
        if (round) {
            round.seoMetadata = metadata
        }
     })
  })

  // Group outputs by model
  const outputsByModel = new Map<ModelKey, Output[]>()
  values(newRound.outputs).forEach(output => {
    if (!outputsByModel.has(output.model)) {
      outputsByModel.set(output.model, [])
    }
    outputsByModel.get(output.model)!.push(output)
  })

  // Fetch for each distinct model
  Array.from(outputsByModel.entries()).forEach(async ([modelKey, outputs]) => {
    if (models[modelKey] === undefined) {
      console.error(`Model ${modelKey} not found`)
      return
    }

    let results: string[] = []

    try {
      if (models[modelKey]!.isImagen) {
        // Fetch all in one go
        results = await generateImage({
          model: models[modelKey]!.modelString,
          systemInstruction: systemInstruction,
          prompt: fullPrompt,
          promptImage: newRound.inputImage,
          isImagen: true,
          isImageOutput: true,
          count: outputs.length
        })
      } else {
        // Fetch sequentially or independently so we don't have to wait for all
        // Actually, we can fetch them in parallel and update the state as each finishes
        outputs.forEach(async (output) => {
           try {
              const res = await generateImage({
                model: models[modelKey]!.modelString,
                systemInstruction: systemInstruction,
                prompt: fullPrompt,
                promptImage: newRound.inputImage,
                isImagen: false,
                isImageOutput: true,
                count: 1
              })
              
              if (res && res.length > 0) {
                 set(state => {
                    const round = state.feed.find(r => r.id === newRound.id)
                    if (!round) return
                    const o = round.outputs[output.id]
                    if (o) {
                       o.srcCode = res[0]
                       o.state = 'success'
                       o.totalTime = Date.now() - o.startTime
                       const userRound = state.userRounds.find(r => r.id === newRound.id)
                       if (userRound && userRound.outputs[output.id]) {
                          userRound.outputs[output.id] = o
                       }
                    }
                 })
              }
           } catch (e) {
              set(state => {
                const round = state.feed.find(r => r.id === newRound.id)
                if (!round) return
                const o = round.outputs[output.id]
                if (o) o.state = 'error'
              })
           }
        })
        return // We handle updates inside the forEach
      }
    } catch (e) {
      console.error(e)
      set(state => {
        const round = state.feed.find(round => round.id === newRound.id)
        if (!round) return
        outputs.forEach(output => {
          const o = round.outputs[output.id]
          if (o) o.state = 'error'
        })
      })
      return
    } finally {
      if (models[modelKey]!.isImagen) {
         set(state => {
           const round = state.feed.find(round => round.id === newRound.id)
           if (!round) return
           outputs.forEach(output => {
             const o = round.outputs[output.id]
             if (o) o.totalTime = Date.now() - o.startTime
           })
         })
      }
    }

    if (models[modelKey]!.isImagen && results && results.length > 0) {
      set(state => {
        const round = state.feed.find(round => round.id === newRound.id)
        if (!round) return
        
        outputs.forEach((output, index) => {
          const res = results[index]
          const o = round.outputs[output.id]
          
          if (o) {
            if (res) {
              o.srcCode = res
              o.state = 'success'
            } else {
              o.state = 'error'
            }

            const userRound = state.userRounds.find(
              r => r.id === newRound.id
            )
            if (userRound && userRound.outputs[output.id]) {
              userRound.outputs[output.id] = o
            }
          }
        })
      })
    }
  })
}

export const removeRound = (id: string) =>
  set(state => {
    state.feed = state.feed.filter(round => round.id !== id)
    state.userRounds = state.userRounds.filter(round => round.id !== id)
  })

export const setOutputMode = (mode: ModeKey) =>
  set(state => {
    state.outputMode = mode
  })

export const setActiveLayout = (layout: LayoutKey) =>
    set(state => {
      state.activeLayout = layout
    })
  
export const setBatchModel = (model: ModelKey) =>
  set(state => {
    state.batchModel = model
  })

export const setBatchMode = (active: boolean) =>
  set(state => {
    state.batchMode = active
  })

export const setBatchSize = (size: number) =>
  set(state => {
    state.batchSize = size
  })

export const setVersusModel = (model: ModelKey, active: boolean) =>
  set(state => {
    state.versusModels[model] = active
  })

export const reset = () =>
  set(state => {
    state.feed = []
  })

export const setFullscreenActiveId = (id: Id | null) =>
  set(state => {
    state.fullscreenActiveId = id
  })

export const setFullscreenAnimate = (active: boolean) =>
  set(state => {
    state.fullscreenAnimate = active
  })

export const setFullscreenShowCode = (active: boolean) =>
  set(state => {
    state.fullscreenShowCode = active
  })

export const setFullscreenSound = (active: boolean) =>
  set(state => {
    state.fullScreenSound = active
  })

export const setScreensaverSound = (active: boolean) =>
  set(state => {
    state.screensaverSound = active
  })

export const setFeed = (feed: Round[]) =>
  set(state => {
    state.feed = feed
  })

export const setScreensaverMode = (active: boolean) =>
  set(state => {
    state.screensaverMode = active
  })

export const setActiveCollectionId = (id: string | null) =>
  set(state => {
    state.activeCollectionId = id
  })

export const setHeaderHeight = (height: number) =>
  set(state => {
    state.headerHeight = height
  })

export const setActiveResultId = (id: string | null) =>
  set(state => {
    state.activeResultId = id
  })

export const setSpecialAllCollectionScreensaverMode = (active: boolean) =>
  set(state => {
    state.specialAllCollectionScreensaverMode = active
  })


init()
