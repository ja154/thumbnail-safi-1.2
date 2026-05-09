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
      <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto items-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Build High-CTR Thumbnails.</h2>
        <p className="text-lg text-secondary text-center">
          ThumbnailSafi transforms your video concepts into attention-grabbing visuals. Select a style, pick a layout, and generate instantly.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <div className="text-sm uppercase font-bold tracking-widest text-tertiary mb-2">
          Start with a Template
        </div>

        <div className="grid grid-cols-1 gap-6">
        {frontpageOrder.map(key => {
          const mode = modes[key]
          return (
            <div key={key} className="w-full">
              <div className="selector presetList">
                <ul className="presets wrapped flex flex-wrap items-center gap-2">
                  <span className="mr-3 opacity-70 font-medium whitespace-nowrap min-w-[120px]">{mode.emoji} {mode.name}</span>
                  {shuffle(presets[key])
                    .slice(0, 4)
                    .map(({label, prompt}) => (
                      <li key={label}>
                        <button
                          onClick={() => {
                            setOutputMode(key)
                            addRound(prompt, null)
                          }}
                          className="chip hover:bg-quaternary transition-colors shadow-sm"
                          style={{
                            padding: '4px 12px'
                          }}
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