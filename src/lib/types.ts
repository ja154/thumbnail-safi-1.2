
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type Id = `${string}-${string}-${string}-${string}-${string}`

export type Preset = {
  label: string
  prompt: string
}

export type Mode = {
  name: string
  emoji: string
  syntax: 'image'
  // default system instructions
  systemInstruction: string
  getTitle: (prompt: string) => string
  presets: Preset[]
  imageOutput: boolean
}

export type Layout = {
  id: string
  name: string
  emoji: string
  promptSuffix: string
}

export type LayoutKey = 'subject-right' | 'subject-left' | 'split' | 'center' | 'minimal'

export type Modes = {
  [key: string]: Mode
}

export type ModeKey = 'default' | 'tech_anime' | 'cinematic' | 'vibrant' | 'minimalist'

export type Model = {
  name: string
  version: string
  modelString: string
  shortName: string
  thinkingCapable: boolean
  thinking: boolean
  imageOutput: boolean
  isImagen: boolean
  order: number
}

export type Models = {
  [key: string]: Model
}

export type ModelKey = 'imagen' | 'flashImage'

export type OutputState = 'loading' | 'success' | 'error'

export type Output = {
  id: Id
  model: ModelKey
  mode: ModeKey
  srcCode: string
  state: OutputState
  startTime: number
  totalTime: number
}

export type SeoMetadata = {
  title: string
  description: string
  tags: string[]
}

export type Round = {
  id: Id
  prompt: string
  inputImage: string | null
  systemInstructions: string
  outputs: {
    [key: Id]: Output
  }
  mode: ModeKey
  layout: LayoutKey
  seoMetadata?: SeoMetadata
  createdBy: string
  createdAt: number
  isDeleted?: boolean
  favoritedOutputIds?: Id[]
  hasFavorites?: boolean
  // optional show only favorites flag for UI purposes
  favoritesOnly?: boolean
}

export type AppState = {
  didInit: boolean
  feed: Round[]
  userRounds: Round[]
  outputMode: ModeKey
  activeLayout: LayoutKey
  batchMode: boolean
  batchSize: number
  batchModel: ModelKey
  versusModels: {
    [key in ModelKey]: boolean
  }
  activeCollectionId: string | null
  activeResultId: string | null
  fullscreenActiveId: Id | null
  fullscreenAnimate: boolean
  fullscreenShowCode: boolean
  fullScreenSound: boolean
  screensaverMode: boolean
  screensaverSound: boolean
  headerHeight: number
  specialAllCollectionScreensaverMode: boolean
}

export type ExportFormat = {
  id: string
  batchId: string
  type: string
  inputImage: string | null
  createdAt: number
  prompt: string
  systemInstructions: string
  code: string
  model: string
  createdBy: string
  generateionTime: number
}
