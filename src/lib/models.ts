
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type {Models, Model} from './types'

const models = {
  imagen: {
    name: 'Imagen 4',
    version: '4.0',
    modelString: 'imagen-4.0-generate-001',
    shortName: 'Imagen',
    thinkingCapable: false,
    thinking: false,
    imageOutput: true,
    isImagen: true,
    order: 1
  },
  flashImage: {
    name: 'Flash Image',
    version: '2.5',
    modelString: 'gemini-2.5-flash-image',
    shortName: 'Flash',
    thinkingCapable: false,
    thinking: false,
    imageOutput: true,
    isImagen: false,
    order: 2
  }
} as const

export const activeModelKeys = [
  'imagen',
  'flashImage'
] as const

export type ActiveModelKey = (typeof activeModelKeys)[number]

let _activeModels = {} as Record<ActiveModelKey, Model>
activeModelKeys.forEach(key => {
  _activeModels[key] = models[key]
})
export const activeModels = _activeModels as {
  [K in ActiveModelKey]: (typeof models)[K]
}

export default models as Models
