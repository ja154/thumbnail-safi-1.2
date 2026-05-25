import {useCallback, useEffect, useRef, useState} from 'react'
import c from 'clsx'
import {
  addRound,
  setOutputMode,
  setActiveLayout,
  setBatchModel,
  setBatchSize,
  setFullscreenActiveId
} from '../lib/actions'
import {activeModels, type ActiveModelKey} from '../lib/models'
import modes, {frontpageOrder, layouts, layoutOrder} from '../lib/modes'
import {use} from '../lib/store'

export function Workspace() {
  const outputMode = use.outputMode()
  const activeLayout = use.activeLayout()
  const batchMode = use.batchMode()
  const batchModel = use.batchModel()
  const batchSize = use.batchSize()
  const userRounds = use.userRounds()

  const [inputImage, setInputImage] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [prompt, setPrompt] = useState('')

  const handleImageSet = async (file: File) => {
    if (file) {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      setInputImage(base64 as string)
    }
  }

  const handleGenerate = () => {
    if (prompt.trim()) {
      addRound(prompt, inputImage)
      setPrompt('')
    }
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-bg-primary text-text-primary">
      {/* Left Pane: Config & History */}
      <div className="w-full md:w-1/2 lg:w-3/5 border-b md:border-b-0 md:border-r border-border-primary flex flex-col overflow-y-auto">
        <div className="p-6 flex flex-col gap-8 flex-1">
          {/* Styles */}
          <div>
             <h3 className="text-xl font-bold mb-4 tracking-tight">Select Style</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {frontpageOrder.map((key) => {
                  const mode = modes[key]
                  const isSelected = outputMode === key
                  return (
                    <button
                      key={key}
                      onClick={() => setOutputMode(key)}
                      className={c(
                        "relative text-left p-4 rounded-xl border transition-all duration-200 group overflow-hidden",
                        isSelected 
                          ? "border-accent bg-accent/5 ring-1 ring-accent" 
                          : "border-border-primary bg-bg-secondary hover:border-border-secondary"
                      )}
                    >
                      {/* Selection Dot */}
                      <div className={c(
                        "absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-colors",
                        isSelected ? "border-accent bg-accent" : "border-border-secondary bg-transparent group-hover:border-text-tertiary"
                      )} />
                      
                      <div className="flex items-center gap-2 font-bold mb-3 text-[17px]">
                        <span>{mode?.emoji}</span>
                        <span className={isSelected ? 'text-accent' : ''}>{mode?.name}</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-snug">
                         {mode?.systemInstruction.length > 80 ? mode?.systemInstruction.substring(0, 80) + '...' : mode?.systemInstruction}
                      </p>
                    </button>
                  )
                })}
             </div>
          </div>

          {/* Layouts */}
          <div className="border-t border-border-primary pt-8">
            <h3 className="text-xl font-bold mb-4 tracking-tight">Layout</h3>
            <div className="flex flex-wrap gap-3">
              {layoutOrder.map((key) => {
                const layout = layouts[key]
                const isSelected = activeLayout === key
                return (
                  <button
                    key={key}
                    onClick={() => setActiveLayout(key)}
                    className={c(
                      "flex items-center gap-2 px-4 py-3 rounded-lg border font-medium transition-all",
                      isSelected
                        ? "border-accent bg-accent text-white shadow-md shadow-accent/20"
                        : "border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                    )}
                  >
                    <span className="text-lg">{layout?.emoji}</span>
                    <span>{layout?.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* History Thumbnails */}
          {userRounds.length > 0 && (
            <div className="border-t border-border-primary pt-8 mt-auto">
              <h3 className="text-xl font-bold mb-4 tracking-tight">Recent Outputs</h3>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {userRounds.slice(0, 5).map(round => {
                  const outputArray = Object.values(round.outputs);
                  const firstOutput = outputArray[0];
                  if (!firstOutput) return null;
                  
                  return (
                    <button 
                      key={round.id} 
                      className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-border-secondary shadow-sm group hover:border-accent transition-colors cursor-pointer"
                      onClick={() => setFullscreenActiveId(firstOutput.id)}
                    >
                       {firstOutput.state === 'success' && firstOutput.srcCode ? (
                         <img 
                            src={firstOutput.srcCode} 
                            alt="Recent Output" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                          />
                       ) : firstOutput.state === 'error' ? (
                         <div className="w-full h-full bg-error/10 flex items-center justify-center text-error border border-error">Error</div>
                       ) : (
                         <div className="w-full h-full bg-bg-secondary flex flex-col items-center justify-center animate-pulse">
                           <span className="icon text-text-tertiary text-2xl mb-1 animate-spin">sync</span>
                         </div>
                       )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Generation Pipeline */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col bg-bg-secondary overflow-y-auto">
        <div className="p-6 md:p-8 flex flex-col gap-6 flex-1 max-w-lg mx-auto w-full">
           <div>
               <h3 className="text-2xl font-bold mb-6 tracking-tight">Generate</h3>
           </div>
           
           {/* Prompt */}
           <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Prompt</label>
              <textarea 
                 value={prompt}
                 onChange={e => setPrompt(e.target.value)}
                 className="w-full bg-bg-primary border border-border-primary rounded-xl p-4 text-text-primary resize-none h-32 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-shadow shadow-sm font-medium"
                 placeholder="Describe the main subject, action, and setting..."
                 style={{fontFamily: 'var(--base-font)'}}
              />
           </div>

           {/* Reference Image */}
           <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Reference Image (Optional)</label>
               <div
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border-secondary rounded-xl bg-bg-primary hover:bg-bg-tertiary transition-colors cursor-pointer group"
                  onClick={() => imageInputRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleImageSet(e.dataTransfer.files[0])
                    }
                  }}
                >
                  <input
                    type="file"
                    ref={imageInputRef}
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageSet(e.target.files[0])
                      }
                    }}
                  />
                  {inputImage ? (
                    <div className="relative w-full h-full p-2 group">
                      <img src={inputImage} className="w-full h-full object-contain rounded-lg" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                        <span className="text-white font-medium">Replace Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-text-tertiary group-hover:text-accent transition-colors">
                      <span className="icon text-3xl">upload_file</span>
                      <span className="text-sm font-medium">Drop or Browse</span>
                    </div>
                  )}
                </div>
           </div>

           {/* Model */}
           <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Model</label>
              <div className="relative">
                <select 
                  className="w-full bg-bg-primary border border-border-primary rounded-xl p-3 pl-4 pr-10 text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none appearance-none font-medium shadow-sm transition-shadow"
                  value={batchModel}
                  onChange={(e) => setBatchModel(e.target.value)}
                >
                  {Object.keys(activeModels).map(key => (
                     <option key={key} value={key}>{activeModels[key as ActiveModelKey]?.name}</option>
                  ))}
                </select>
                <span className="icon absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">expand_more</span>
              </div>
           </div>

           {/* Batch Size */}
           <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                 <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Batch Size</label>
                 <span className="text-lg font-bold text-accent">{batchSize}</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                value={batchSize}
                onChange={e => setBatchSize(e.target.valueAsNumber)}
                className="w-full h-2 bg-bg-quaternary rounded-lg appearance-none cursor-pointer accent-accent"
              />
           </div>
           
           <div className="mt-4 pb-12 md:pb-0">
             <button 
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold text-lg py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
             >
                <span className="icon">bolt</span>
                Generate Now
             </button>
           </div>
        </div>
      </div>
    </div>
  )
}
