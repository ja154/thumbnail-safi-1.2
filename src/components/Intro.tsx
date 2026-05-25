/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useState} from 'react'
import shuffle from 'lodash/shuffle'
import type {ModeKey, Preset} from '../lib/types'
import modes, {frontpageOrder} from '../lib/modes'
import {addRound, setOutputMode, setBatchModel} from '../lib/actions'
import {use} from '../lib/store'
import {entries, fromEntries} from '../lib/utils'

export default function Intro() {
  const batchModel = use.batchModel()
  const [presets] = useState<Record<ModeKey, Preset[]>>(() =>
    fromEntries(
      entries(modes).map(([key, mode]) => [
        key,
        shuffle(mode.presets.slice(0, 50))
      ])
    )
  )

  return (
    <section className="intro text-primary flex-1 flex flex-col items-center justify-center -mt-20">
      <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto items-center mb-16">
        <h2 className="text-[40px] md:text-5xl font-extrabold tracking-tighter mb-2 leading-tight">Create High-CTR<br/><span className="text-primary">Thumbnails</span>.</h2>
        <p className="text-[17px] text-text-secondary text-center leading-relaxed max-w-xl mx-auto">
          ThumbnailSafi transforms your video concepts into attention-grabbing visuals. Select a style, pick a layout, and generate instantly.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[800px] mx-auto">
        {frontpageOrder.map(key => {
          const mode = modes[key]
          return (
            <div key={key} className="w-full bg-bg-secondary p-5 rounded-2xl border border-border-primary transition-all hover:border-border-secondary group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-2 font-semibold text-text-primary text-[17px]">
                      <span>{mode.emoji}</span>
                      <span>{mode.name}</span>
                  </div>
                  <ul className="flex flex-wrap items-center gap-2">
                  {shuffle(presets[key])
                    .slice(0, 3)
                    .map(({label, prompt}) => (
                      <li key={label}>
                        <button
                          onClick={() => {
                            setOutputMode(key)
                            addRound(prompt, null)
                          }}
                          className="px-3 py-1.5 rounded-md bg-bg-primary border border-border-primary text-text-secondary text-sm hover:bg-bg-tertiary hover:text-text-primary transition-colors font-medium cursor-pointer"
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
              </div>
            </div>
          )
        })}
        </div>
      </div>
    </section>
  )
}