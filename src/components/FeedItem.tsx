/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type {Round} from '../lib/types'
import {useState, type FC} from 'react'
import c from 'clsx'
import {addRound, removeRound} from '../lib/actions'
import modes, {layouts} from '../lib/modes'
import {values} from '../lib/utils'
import ModelOutput from './ModelOutput'
import models from '../lib/models'

type FeedItemProps = {
  round: Round
  showOnlyFavorited?: boolean
}

const FeedItem: FC<FeedItemProps> = ({round, showOnlyFavorited}) => {
  const [showSystemInstruction, setShowSystemInstruction] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Filter outputs based on showOnlyFavorited prop and ensure model exists
  const filteredOutputs = values(round.outputs).filter(output => {
    if (showOnlyFavorited && !round.favoritedOutputIds?.includes(output.id)) {
      return false
    }
    return models[output.model] !== undefined
  })

  // Don't render if no outputs are left to show
  if (filteredOutputs.length === 0) {
    return null
  }

  const sortedOutputs = filteredOutputs.sort(
    (a, b) => models[a.model]!.order - models[b.model]!.order
  )
  const numOutputs = sortedOutputs.length

  // Infer the original configuration from the round's outputs
  const inferRoundConfig = () => {
    const validOutputs = values(round.outputs).filter(output => models[output.model] !== undefined)
    if (validOutputs.length === 0) return {}

    // Check if all outputs use the same model (batch mode)
    const firstModel = validOutputs[0]!.model
    const isBatchMode = validOutputs.every(output => output.model === firstModel)

    if (isBatchMode) {
      return {
        outputMode: round.mode,
        activeLayout: round.layout,
        batchMode: true,
        batchSize: validOutputs.length,
        batchModel: firstModel
      }
    } else {
      // Versus mode - reconstruct which models were active
      const activeModels: {[key: string]: boolean} = {}
      validOutputs.forEach(output => {
        activeModels[output.model] = true
      })
      return {
        outputMode: round.mode,
        activeLayout: round.layout,
        batchMode: false,
        versusModels: activeModels
      }
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <li
      key={round.id}
      style={{maxWidth: 20 * 2 + numOutputs * 700 + (numOutputs - 1) * 20}}
    >
      <div className={c('header', {anchorTop: showSystemInstruction})}>
        <h3 className={c({anchorTop: showSystemInstruction})}>
          <div className="chip">
            {modes[round.mode]?.emoji} {modes[round.mode]?.name}
          </div>
          <div className="chip">
             {layouts[round.layout]?.emoji} {layouts[round.layout]?.name?.split(' ')[0]}
          </div>
          <div className="prompt">
            {showSystemInstruction && (
              <p className="systemInstruction">
                {modes[round.mode]?.systemInstruction}
              </p>
            )}
            <p>{round.prompt}</p>
          </div>
        </h3>
        <div className="actions">
          <button
            className="iconButton"
            onClick={() => setShowSystemInstruction(!showSystemInstruction)}
          >
            <span className="icon">subject</span>
            <span className="tooltip">
              {showSystemInstruction ? 'Hide' : 'Show'} system instruction
            </span>
          </button>

          <button
            className="iconButton"
            onClick={() =>
              addRound(round.prompt, round.inputImage, inferRoundConfig())
            }
          >
            <span className="icon">refresh</span>
            <span className="tooltip">Re-run prompt</span>
          </button>

          {round.createdBy === 'anonymous' && (
            <button
              className="iconButton"
              onClick={() => removeRound(round.id)}
            >
              <span className="icon">delete</span>
              <span className="tooltip">Remove</span>
            </button>
          )}
        </div>
      </div>

      <ul className="outputs">
        {sortedOutputs.map(output => (
          <li key={output.id}>
            <ModelOutput output={output} round={round} />
          </li>
        ))}
      </ul>
      
      {round.seoMetadata && (
        <div className="mt-4 p-4 bg-bg-quaternary rounded-lg border border-border-primary text-text-primary w-full">
            <div className="flex gap-2 items-center mb-4 text-text-secondary text-xs uppercase tracking-wider font-bold border-b border-border-secondary pb-2">
                <span className="icon text-sm">search</span> SEO Metadata
            </div>
            <div className="grid gap-4">
                <div className="relative group">
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-xs text-text-tertiary">Video Title</div>
                        <button 
                            onClick={() => copyToClipboard(round.seoMetadata!.title, 'title')}
                            className="flex items-center gap-1 text-xs bg-bg-primary border border-border-secondary px-2 py-1 rounded hover:bg-bg-secondary transition-colors"
                        >
                            <span className="icon text-[12px]">{copiedField === 'title' ? 'check' : 'content_copy'}</span>
                            {copiedField === 'title' ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="font-bold text-lg leading-tight">{round.seoMetadata.title}</div>
                </div>
                 <div className="relative group">
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-xs text-text-tertiary">Description</div>
                        <button 
                            onClick={() => copyToClipboard(round.seoMetadata!.description, 'desc')}
                            className="flex items-center gap-1 text-xs bg-bg-primary border border-border-secondary px-2 py-1 rounded hover:bg-bg-secondary transition-colors"
                        >
                            <span className="icon text-[12px]">{copiedField === 'desc' ? 'check' : 'content_copy'}</span>
                            {copiedField === 'desc' ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="text-sm opacity-90 whitespace-pre-wrap">{round.seoMetadata.description}</div>
                </div>
                 <div className="relative group">
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-xs text-text-tertiary">Tags</div>
                         <button 
                            onClick={() => copyToClipboard(round.seoMetadata?.tags?.join(', ') || '', 'tags')}
                            className="flex items-center gap-1 text-xs bg-bg-primary border border-border-secondary px-2 py-1 rounded hover:bg-bg-secondary transition-colors"
                        >
                            <span className="icon text-[12px]">{copiedField === 'tags' ? 'check' : 'content_copy'}</span>
                            {copiedField === 'tags' ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(round.seoMetadata?.tags || []).map(tag => (
                            <span key={tag} className="bg-bg-primary px-2 py-1 rounded text-xs border border-border-secondary text-text-secondary">#{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </li>
  )
}

export default FeedItem