/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useCallback, useEffect, useRef, useState} from 'react'
import {
  addRound as _addRound,
  setOutputMode,
  setActiveLayout,
  setBatchMode,
  setBatchModel,
  setBatchSize,
  setVersusModel,
  setFeed,
  setHeaderHeight,
  setActiveCollectionId,
  setActiveResultId
} from '../lib/actions'
import {activeModels, type ActiveModelKey} from '../lib/models'
import c from 'clsx'
import {keys} from '../lib/utils'
import {isTouch} from '../lib/consts'
import modes, {frontpageOrder, layouts, layoutOrder} from '../lib/modes'
import {use} from '../lib/store'
import type {Preset, ModelKey} from '../lib/types'
import {shuffle} from 'lodash'

export function Header({
  activeCollectionId
}: {
  activeCollectionId?: string | null
}) {
  const outputMode = use.outputMode()
  const activeLayout = use.activeLayout()
  const batchModel = use.batchModel()
  const versusModels = use.versusModels()
  const batchMode = use.batchMode()
  const batchSize = use.batchSize()
  const userRounds = use.userRounds()

  function addRound(...args: Parameters<typeof _addRound>) {
    if (activeCollectionId) {
      setActiveCollectionId(null)
      setActiveResultId(null)
      setFeed([]) // Clear collection when adding a new round
    }
    _addRound(...args)
  }

  // migration for models being deactivated
  useEffect(() => {
    for (const key of keys(versusModels)) {
      if (!activeModels[key as ActiveModelKey]) {
        setVersusModel(key as ModelKey, false)
      }
    }
    if (activeModels[batchModel] === undefined) {
      setBatchModel(keys(activeModels)[0]!)
    }
  }, [activeModels])

  const headerRef = useRef<HTMLElement>(null)
  // Track header height with ResizeObserver
  useEffect(() => {
    if (!headerRef.current) return

    const observer = new ResizeObserver(entries => {
      const height = entries[0]?.contentRect.height
      if (height) {
        setHeaderHeight(height)
      }
    })

    observer.observe(headerRef.current)

    return () => observer.disconnect()
  }, [])

  const [presets, setPresets] = useState<Preset[]>([])
  const [showPresets, setShowPresets] = useState(false)
  const [showModes, setShowModes] = useState(false)
  const [showLayouts, setShowLayouts] = useState(false)
  const [showModels, setShowModels] = useState(false)
  const [inputImage, setInputImage] = useState<string | null>(null)

  // Collapse header on small screens
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [_showFullHeader, setShowFullHeader] = useState(false)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const isSmallScreen = windowWidth < 768
  const showFullHeader = isSmallScreen ? _showFullHeader : true

  const inputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

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

  const shufflePresets = useCallback(
    () => setPresets(shuffle(modes[outputMode]?.presets ?? [])),
    [outputMode]
  )

  useEffect(() => {
    shufflePresets()
  }, [shufflePresets])

  return (
    <header ref={headerRef} className={showFullHeader ? '' : 'hide'}>
      <div className="inner-header cursor-pointer">
        <h1
          onClick={() => {
            setActiveCollectionId(null)
            setActiveResultId(null)
            setFeed([])
          }}
        >
          <p>
            Thumbnail<span>🖼️</span>
          </p>
          <p>Safi</p>
        </h1>
        
        {/* Style Selector */}
        <div
          className="selectorWrapper header-toggle"
          onMouseEnter={!isTouch ? () => setShowModes(true) : void 0}
          onMouseLeave={!isTouch ? () => setShowModes(false) : void 0}
          onTouchStart={
            isTouch
              ? e => {
                  e.stopPropagation()
                  setShowModes(true)
                  setShowModels(false)
                  setShowPresets(false)
                  setShowLayouts(false)
                }
              : void 0
          }
        >
          <p>
            {modes[outputMode]?.emoji} {modes[outputMode]?.name}
          </p>
          <div className={c('selector', {active: showModes})}>
            <ul>
              {frontpageOrder.map(key => (
                <li key={key}>
                  <button
                    className={c('chip', {primary: key === outputMode})}
                    onClick={() => {
                      setOutputMode(key)
                      setShowModes(false)
                    }}
                  >
                    {modes[key]?.emoji} {modes[key]?.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="label">Style</div>
        </div>

        {/* Layout Selector */}
        <div
          className="selectorWrapper header-toggle"
          onMouseEnter={!isTouch ? () => setShowLayouts(true) : void 0}
          onMouseLeave={!isTouch ? () => setShowLayouts(false) : void 0}
          onTouchStart={
            isTouch
              ? e => {
                  e.stopPropagation()
                  setShowLayouts(true)
                  setShowModes(false)
                  setShowModels(false)
                  setShowPresets(false)
                }
              : void 0
          }
        >
          <p>
            {layouts[activeLayout]?.emoji} {layouts[activeLayout]?.name.split(' ')[0]}
          </p>
          <div className={c('selector', {active: showLayouts})}>
            <ul>
              {layoutOrder.map(key => (
                <li key={key}>
                  <button
                    className={c('chip', {primary: key === activeLayout})}
                    onClick={() => {
                      setActiveLayout(key)
                      setShowLayouts(false)
                    }}
                  >
                    {layouts[key]?.emoji} {layouts[key]?.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="label">Layout</div>
        </div>

        {/* Model Selector */}
        <div
          className="selectorWrapper header-toggle"
          onMouseEnter={!isTouch ? () => setShowModels(true) : void 0}
          onMouseLeave={!isTouch ? () => setShowModels(false) : void 0}
          onTouchStart={
            isTouch
              ? e => {
                  e.stopPropagation()
                  setShowModels(true)
                  setShowModes(false)
                  setShowPresets(false)
                  setShowLayouts(false)
                }
              : void 0
          }
        >
          <p>
            {batchMode
              ? activeModels[batchModel as ActiveModelKey]?.name
              : keys(versusModels).filter(key => versusModels[key]).length +
                ' selected'}
          </p>
          <div className={c('selector', {active: showModels})}>
            <ul>
              {keys(activeModels)
                .map(key => (
                  <li key={key}>
                    <button
                      className={c('chip', {
                        primary: batchMode
                          ? key === batchModel
                          : versusModels[key]
                      })}
                      onClick={() => {
                        if (batchMode) {
                          setBatchModel(key)
                          setShowModels(false)
                        } else {
                          setVersusModel(key, !versusModels[key])
                        }
                      }}
                    >
                      {activeModels[key]?.version} {activeModels[key]?.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          <div className="label">Model{batchMode ? '' : 's'}</div>
        </div>

        {/* Image Input */}
        <div
          className="imageInput header-toggle"
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
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                handleImageSet(e.target.files[0])
              }
            }}
          />
          <div className="dropZone">
            {inputImage && <img src={inputImage} />}
            Drop Ref
          </div>
          <div className="label">Reference</div>
        </div>

        <div
          className="selectorWrapper prompt header-toggle"
          onMouseEnter={!isTouch ? () => setShowPresets(true) : void 0}
          onMouseLeave={!isTouch ? () => setShowPresets(false) : void 0}
          onTouchStart={
            isTouch
              ? e => {
                  e.stopPropagation()
                  setShowPresets(true)
                  setShowModes(false)
                  setShowModels(false)
                }
              : void 0
          }
        >
          <input
            className="promptInput"
            placeholder="Describe your thumbnail..."
            onFocus={!isTouch ? () => setShowPresets(false) : void 0}
            ref={inputRef}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addRound(e.currentTarget.value, inputImage)
                e.currentTarget.blur()
              }
            }}
          />
          <div className={c('selector header-toggle ', {active: showPresets})}>
            <ul className="presets wrapped">
              <li>
                <button
                  onClick={() => {
                    const randomPreset =
                      presets[Math.floor(Math.random() * presets.length)]
                    if (randomPreset) {
                      addRound(randomPreset.prompt, null)
                    }
                    setShowPresets(false)
                  }}
                  className="chip primary"
                >
                  <span className="icon">Ifl</span>
                  Random Idea
                </button>
              </li>
              {presets.map(({label, prompt}) => (
                <li key={label}>
                  <button
                    onClick={() => {
                      addRound(prompt, null)
                      setShowPresets(false)
                    }}
                    className="chip"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="label">Prompt</div>
        </div>
        {batchMode && (
          <div className="header-toggle">
            <div className="rangeWrap">
              <div className="batchSize">
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={batchSize}
                  onChange={e => setBatchSize(e.target.valueAsNumber)}
                />{' '}
                {batchSize}
              </div>
            </div>
            <div className="label">Batch size</div>
          </div>
        )}
        <div className="header-toggle">
          <button
            className="circleButton resetButton"
            onClick={() => {
              setActiveCollectionId(null)
              setFeed(userRounds)
            }}
          >
            {userRounds.length}
          </button>
          <div className="label">Yours</div>
        </div>
      </div>
      {isSmallScreen && (
        <div
          style={{
            position: 'absolute',
            right: 18,
            top: 18
          }}
        >
          <button
            className="circleButton toggleHeaderButton"
            onClick={() => {
              setShowFullHeader(!_showFullHeader)
            }}
          >
            <span className="icon">
              {showFullHeader ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      )}
    </header>
  )
}