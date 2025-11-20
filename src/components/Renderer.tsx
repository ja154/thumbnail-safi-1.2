/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type {ModeKey} from '../lib/types'
import {memo, useEffect, useRef, useState} from 'react'
import {outputWidth} from '../lib/consts'
import {identity} from '../lib/utils'
import {use} from '../lib/store'

type RendererProps = {
  mode: ModeKey
  code: string
  isFullscreen?: boolean
}

function Renderer({mode, code, isFullscreen}: RendererProps) {
  return (
    <div
      className={`renderer imageRenderer bg-black`}
      style={{height: isFullscreen ? '100%' : undefined}}
    >
      <img src={code} alt="Generated thumbnail" className="w-full h-full object-contain" />
    </div>
  )
}

export default memo(Renderer)

const scaffolds: {[key in ModeKey]: (code: string) => string} = {
  default: identity,
  tech_anime: identity,
  cinematic: identity,
  vibrant: identity,
  minimalist: identity
}