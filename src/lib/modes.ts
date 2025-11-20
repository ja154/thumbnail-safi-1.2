
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type {Modes, Layout} from './types'

export const layouts: Record<string, Layout> = {
  'subject-right': {
    id: 'subject-right',
    name: 'Subject Right / Text Left',
    emoji: '👉',
    promptSuffix: 'The composition is split: the expressive subject is positioned on the RIGHT side of the frame, while massive, bold text fills the negative space on the LEFT side.'
  },
  'subject-left': {
    id: 'subject-left',
    name: 'Subject Left / Text Right',
    emoji: '👈',
    promptSuffix: 'The composition is split: the expressive subject is positioned on the LEFT side of the frame, while massive, bold text fills the negative space on the RIGHT side.'
  },
  'split': {
    id: 'split',
    name: 'Split Screen Comparison',
    emoji: '🌗',
    promptSuffix: 'A vertical split-screen composition. Side A is on the left, Side B is on the right, separated by a distinct line or lightning bolt effect. Text is centered or in corners.'
  },
  'center': {
    id: 'center',
    name: 'Centered Subject',
    emoji: '🎯',
    promptSuffix: 'The subject is perfectly centered in the frame, facing the camera directly. Text is placed symmetrically above or below the subject.'
  },
  'minimal': {
    id: 'minimal',
    name: 'Object Focus',
    emoji: '🔍',
    promptSuffix: 'Macro photography focus on a single object in the center. The background is a solid, flat matte color. Text is minimal and clean.'
  }
}

export const layoutOrder = ['subject-right', 'subject-left', 'split', 'center', 'minimal'] as const

const f = (s: string) =>
  s
    .replace(/([^\n{])\n([^\n}\s+])/g, '$1 $2')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

// The "Base Style" is injected into every generation to ensure the "Viral" look
const baseStyle = `
Style: Professional High-CTR YouTube Thumbnail.
Visuals: Hyper-realistic 8k resolution, highly detailed skin texture, sharp focus, cinematic lighting.
Lighting: Strong key light on the face, distinct vibrant RIM LIGHT (backlight) to separate subject from background.
Colors: High saturation, high contrast.
Text: If text is specified, it is rendered in MASSIVE, BOLD, SANS-SERIF font with heavy drop shadows or outlines for maximum readability.
`

export default {
  default: {
    name: 'Viral / Tech',
    emoji: '🔥',
    syntax: 'image',
    imageOutput: true,
    systemInstruction: f(`\
${baseStyle}
Specific Aesthetic: Tech Youtuber (MKBHD, MrWhosetheboss style).
Clean, crisp, digital look. Backgrounds are usually dark blurred tech environments or gradients.
`),
    getTitle: s => s,
    presets: [
      {label: '🗣️ Viral Talking Head', prompt: 'A YouTuber with a shocked expression pointing at the text "GEMMA 3". Dark blue background with bokeh lights.'},
      {label: '📱 Product Launch', prompt: 'Close up of a sleek black smartphone. Text "IT\'S OVER" in massive red letters. Clean white background.'},
      {label: '💰 Financial Success', prompt: 'A man in a suit holding a stack of cash, smiling widely. Text "10X GAINS" in bright green. Stock chart background.'},
      {label: '⚠️ Warning', prompt: 'Person with hands on head, looking terrified. Text "DON\'T BUY" in yellow warning font. Red alarm lighting.'}
    ]
  },
  tech_anime: {
    name: 'Tech Anime',
    emoji: '🤖',
    syntax: 'image',
    imageOutput: true,
    systemInstruction: f(`\
${baseStyle}
Specific Aesthetic: Anime Art Style, Cel-Shaded.
Vibrant Neon Colors (Cyan, Magenta, Electric Blue).
Exaggerated facial expressions, speed lines, glowing energy effects.
`),
    getTitle: s => s,
    presets: [
      {label: '⚡ Speed', prompt: 'Anime character running with a lightning trail. Text "FASTER?" in jagged electric font.'},
      {label: '🖥️ Setup', prompt: 'A glowing futuristic gaming room setup. Text "DREAM DESK" in neon blue.'},
      {label: '🤖 AI Takeover', prompt: 'A menacing robot face in half-shadow. Text "AI DANGER" in glitchy font.'}
    ]
  },
  cinematic: {
    name: 'Cinematic / Vlog',
    emoji: '🎬',
    syntax: 'image',
    imageOutput: true,
    systemInstruction: f(`\
${baseStyle}
Specific Aesthetic: Movie Poster, Travel Vlog, Documentary.
Color Grading: Teal & Orange, moody shadows, sun flares.
Texture: Film grain, realistic depth of field.
`),
    getTitle: s => s,
    presets: [
      {label: '🏔️ Adventure', prompt: 'Back of a hiker looking at a massive epic mountain. Text "I SURVIVED" in bold white serif.'},
      {label: '🌆 City Night', prompt: 'Blurry city lights bokeh at night. Subject looking melancholic. Text "GOODBYE" in elegant font.'},
      {label: '🍔 Food Review', prompt: 'Extreme close up macro shot of a juicy burger. Text "BEST EVER" in bold yellow.'}
    ]
  },
  vibrant: {
    name: 'Gaming / 3D',
    emoji: '🎮',
    syntax: 'image',
    imageOutput: true,
    systemInstruction: f(`\
${baseStyle}
Specific Aesthetic: 3D Render, Fortnite, Roblox, Blender style.
Textures: Glossy, plastic, clay-like, or low-poly.
Lighting: Bright, soft studio lighting, primary colors (Red, Blue, Yellow).
`),
    getTitle: s => s,
    presets: [
      {label: '🏆 Win', prompt: 'A 3D character holding a giant gold trophy. Text "VICTORY!" in gold 3D font. Confetti everywhere.'},
      {label: '👻 Horror', prompt: 'A scary monster face close up. Text "TOO SCARY" in dripping red slime font. Dark purple background.'},
      {label: '🎮 Let\'s Play', prompt: 'A gamer character with mouth open in excitement, holding a controller. Text "EPIC MOMENT".'}
    ]
  },
  minimalist: {
    name: 'Minimal / Clean',
    emoji: '✨',
    syntax: 'image',
    imageOutput: true,
    systemInstruction: f(`\
${baseStyle}
Specific Aesthetic: Apple Ad, Design Portfolio, Minimalist.
Composition: Lots of negative space, solid flat colors, soft shadows.
Subject: Isolated object or person.
`),
    getTitle: s => s,
    presets: [
      {label: '📦 Unboxing', prompt: 'A pristine white box on a white table. Text "WHAT IS IT?" in thin black font.'},
      {label: '🤔 Question', prompt: 'A single giant question mark object. Pastel blue background. Text "WHY?".'},
      {label: '🛠️ Tool', prompt: 'A single screwdriver floating in the air. Matte grey background. Text "FIX IT".'}
    ]
  }
} satisfies Modes

export const frontpageOrder = [
  'default',
  'tech_anime',
  'cinematic',
  'vibrant',
  'minimalist'
] as const
