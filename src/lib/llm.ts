
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  type Part,
  type SafetySetting,
  GoogleGenAI,
  Modality,
  HarmCategory,
  HarmBlockThreshold,
  Type,
  type GenerateImagesResponse,
  type GenerateContentResponse
} from '@google/genai'
import limit from 'p-limit'
import type {SeoMetadata} from './types'

const timeoutMs = 193_333
const maxRetries = 3
const baseDelay = 1_233
// Use standard API_KEY env var as per guidelines
const ai = new GoogleGenAI({apiKey: process.env.API_KEY})

type LlmGenParams = {
  model: string
  systemInstruction: string
  prompt: string
  promptImage: string | null
  isImagen: boolean
  isImageOutput: boolean
}

const limiter = limit(9)

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeout = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'))
    }, ms)
  })
  return Promise.race([promise, timeout])
}

const qualitySuffix = 'Photography Settings: f/1.8 aperture for depth of field, ISO 100 for grain-free clarity, 85mm lens for flattering portraits. Lighting: Studio strobe setup with rim light. Render: Unreal Engine 5, Octane Render, 8k.'

export const generateImage = ({
  model,
  systemInstruction,
  prompt,
  promptImage,
  isImagen
}: LlmGenParams) =>
  limiter(async () => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        let resultData: string | undefined

        // Construct a cohesive visual description
        // 1. We want the system instruction (which contains the style)
        // 2. We want the explicit user prompt and layout
        // 3. We want the technical quality boosters
        const combinedPrompt = `
${systemInstruction}

IMAGE DESCRIPTION:
${prompt}

${qualitySuffix}
`.trim()

        if (isImagen) {
          // For Imagen, we send the combined prompt directly
          const modelPromise = ai.models.generateImages({
            model,
            prompt: combinedPrompt,
            config: {
               numberOfImages: 1,
               aspectRatio: '16:9',
               outputMimeType: 'image/jpeg'
            }
          })
          const response: GenerateImagesResponse = await withTimeout(modelPromise, timeoutMs)
          const base64 = response.generatedImages?.[0]?.image?.imageBytes
          if (base64) {
            resultData = `data:image/jpeg;base64,${base64}`
          }
        } else {
          // For Flash Image (generateContent), we can keep systemInstruction separate
          // but prompt must be strong.
          const modelPromise = ai.models.generateContent({
            model,
            config: {
              systemInstruction: systemInstruction,
              safetySettings,
              responseModalities: [Modality.IMAGE]
            },
            contents: [
              {
                parts: [
                  ...(promptImage
                    ? [
                        {
                          inlineData: {
                            data: promptImage.split(',')[1],
                            mimeType: 'image/png'
                          }
                        }
                      ]
                    : []),
                  {text: `${prompt}\n\n${qualitySuffix}`}
                ]
              }
            ]
          })

          const response: GenerateContentResponse = await withTimeout(modelPromise, timeoutMs)
          const data = response.candidates?.[0]?.content?.parts?.find(
            (p: Part) => p.inlineData
          )?.inlineData?.data

          if (data) {
            resultData = 'data:image/png;base64,' + data
          }
        }

        if (!resultData) {
          throw new Error('No image data found')
        }
        return resultData

      } catch (error: unknown) {
        if (attempt === maxRetries - 1) throw error
        const delay = baseDelay * 2 ** attempt
        await new Promise(res => setTimeout(res, delay))
      }
    }
    throw new Error('All retries failed')
  })

export const generateSeoMetadata = async (prompt: string): Promise<SeoMetadata> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {type: Type.STRING},
            description: {type: Type.STRING},
            tags: {type: Type.ARRAY, items: {type: Type.STRING}}
          }
        }
      },
      contents: [
        {text: `Generate YouTube SEO metadata (Title, Description, 5 Tags) for a video based on this thumbnail description: ${prompt}. Make it clickbaity and high CTR.`}
      ]
    })
    
    if (response.text) {
      return JSON.parse(response.text) as SeoMetadata
    }
    throw new Error('No text')
  } catch (e) {
    console.error(e)
    return {
      title: 'Error generating title',
      description: '',
      tags: []
    }
  }
}

const safetySettings: SafetySetting[] = [
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
  HarmCategory.HARM_CATEGORY_HARASSMENT
].map(category => ({category, threshold: HarmBlockThreshold.BLOCK_NONE}))
