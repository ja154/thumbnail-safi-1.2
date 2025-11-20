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
    promptSuffix: 'Composition should have the main subject positioned on the right side, leaving clear negative space on the left for text overlay.'
  },
  'subject-left': {
    id: 'subject-left',
    name: 'Subject Left / Text Right',
    emoji: '👈',
    promptSuffix: 'Composition should have the main subject positioned on the left side, leaving clear negative space on the right for text overlay.'
  },
  'split': {
    id: 'split',
    name: 'Split Screen',
    emoji: '🌗',
    promptSuffix: 'A high contrast split-screen composition comparing two elements side-by-side.'
  },
  'center': {
    id: 'center',
    name: 'Centered / Bold',
    emoji: '🎯',
    promptSuffix: 'Central focus subject with symmetrical composition, optimized for maximum impact.'
  },
  'minimal': {
    id: 'minimal',
    name: 'Minimalist Corner',
    emoji: '↘️',
    promptSuffix: 'Subject located in the bottom corner, majority of image is clean background for flexibility.'
  }
}

export const layoutOrder = ['subject-right', 'subject-left', 'split', 'center', 'minimal']

const f = (s: string) =>
  s
    .replace(/([^\n{])\n([^\n}\s+])/g, '$1 $2')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

export default {
  default: {
    name: 'Default Style',
    emoji: '🔥',
    syntax: 'image',
    imageOutput: true,
    systemInstruction: f(`\
You are an expert YouTube Thumbnail designer. Create high-CTR (Click Through Rate) thumbnail images.
Focus on expressive faces, high contrast, and vibrant lighting.
Ensure the composition follows the rule of thirds.
Do not render text unless explicitly asked.
Output a 16:9 image.`),
    getTitle: s => s,
    presets: [
      {label: '😲 Shocked Face', prompt: 'A young tech reviewer making a shocked expression holding a new smartphone, studio lighting, blurred background'},
      {label: '🆚 Versus', prompt: 'Split screen comparison between a red robot and a blue robot, high contrast, sparks flying'},
      {label: '📈 Growth', prompt: 'A generic graph line going up steeply in green, golden coins in foreground, blurry office background'}
    ]
  },
  tech_anime: {
    name: 'Tech Anime',
    emoji: '🤖',
    syntax: 'image',
    imageOutput: true,
    systemInstruction: f(`\
You are an expert illustrator for Tech YouTube channels.
Create thumbnails in a "Tech Anime" style: crisp vector-like lines, neon accents (cyan, magenta), cel-shading, and futuristic elements.
Focus on dynamic angles and glowing effects.
Output a 16:9 image.`),
    getTitle: s => s,
    presets: [
      {label: '💻 Coding Setup', prompt: 'Cyberpunk style coding desk setup with multiple monitors displaying code, neon blue lighting'},
      {label: '🚀 Future AI', prompt: 'Anime style robot shaking hands with a human, glowing digital particles, futuristic city background'},
      {label: '🏎️ Speed', prompt: 'A futuristic racing car leaving a trail of neon light, anime speed lines effect'}
    ]
  },
  cinematic: {
    name: 'Cinematic',
    emoji: '🎬',
    syntax: 'image',
    imageOutput: true,
    systemInstruction: f(`\
You are a professional cinematographer designing a movie-poster quality YouTube thumbnail.
Use photorealistic rendering, dramatic lighting (chiaroscuro), shallow depth of field (bokeh), and color grading.
Focus on texture and realistic skin tones.
Output a 16:9 image.`),
    getTitle: s => s,
    presets: [
      {label: '🏔️ Epic Travel', prompt: 'Wide shot of a hiker standing on a mountain peak at sunset, dramatic lighting, epic clouds'},
      {label: '🍲 Food Porn', prompt: 'Close up macro shot of a delicious burger with melting cheese, professional food photography lighting'},
      {label: '🕵️ Mystery', prompt: 'Silhouette of a detective in a rainy alleyway, noir lighting, mysterious atmosphere'}
    ]
  },
  vibrant: {
    name: 'Vibrant / Gaming',
    emoji: '🎮',
    syntax: 'image',
    imageOutput: true,
    systemInstruction: f(`\
You are a Gaming YouTuber thumbnail artist.
Use hyper-saturated colors, exaggerated features, and "fortnite-style" 3D rendering.
Focus on action, explosion effects, and purple/orange color schemes.
Output a 16:9 image.`),
    getTitle: s => s,
    presets: [
      {label: '🏆 Victory', prompt: '3D cartoon character holding a golden trophy, confetti explosion, bright purple background'},
      {label: '🧟 Zombie', prompt: 'Scary cartoon zombie reaching towards the camera, green slime effects, saturated colors'},
      {label: '🏰 Base Build', prompt: 'Isometric view of a massive minecraft-style castle, bright blue sky, vibrant green grass'}
    ]
  },
  minimalist: {
    name: 'Clean / Minimal',
    emoji: '✨',
    syntax: 'image',
    imageOutput: true,
    systemInstruction: f(`\
You are a minimalist designer.
Create clean, modern thumbnails with lots of negative space, solid color backgrounds, and simple iconic subjects.
Avoid clutter. Use soft lighting and pastel or matte colors.
Output a 16:9 image.`),
    getTitle: s => s,
    presets: [
      {label: '📱 Review', prompt: 'Top down view of a white smartphone on a solid pastel yellow desk, soft shadow, no clutter'},
      {label: '🧘 Wellness', prompt: 'A single lotus flower floating on water, clean composition, soft blue tones'},
      {label: '💡 Idea', prompt: 'A simple glowing lightbulb on a matte grey background, centered'}
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