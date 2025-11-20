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
import {FeaturedCollections} from './HighlightCarousel'

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
    <section className="intro text-primary">
      <div className="flex flex-col gap-1">
        <div>
          Welcome to <strong>ThumbnailSafi</strong>, the high-CTR thumbnail generator.
        </div>
        <div>Select a style, set a layout, and generate click-worthy visuals instantly.</div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="uppercase font-bold tracking-wider">
          🚀 Quick Start Templates
        </div>

        {frontpageOrder.map(key => {
          const mode = modes[key]
          return (
            <div key={key} className="max-w-2xl">
              <div className="selector presetList">
                <ul className="presets wrapped flex flex-wrap items-center">
                  <span className="mr-2 opacity-70">{mode.emoji} {mode.name}:</span>
                  {shuffle(presets[key])
                    .slice(0, 4)
                    .map(({label, prompt}) => (
                      <li key={label}>
                        <button
                          onClick={() => {
                            setOutputMode(key)
                            addRound(prompt, null)
                          }}
                          className="chip"
                          style={{
                            padding: '1px 8px'
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
    </section>
  )
}