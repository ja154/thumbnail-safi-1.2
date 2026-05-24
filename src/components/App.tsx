/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import Intro from './Intro'
import {Header} from './Header'
import {Sidebar} from './Sidebar'
import {Collection} from './Collection'
import {use} from '../lib/store'
import FeedItem from './FeedItem'
import {FullscreenOverlay} from './FullscreenOverlay'
import {Screensaver} from './Screensaver'
import {initializeAudio} from '../lib/useTonePalette'
import {setActiveCollectionId, setActiveResultId, setScreensaverMode} from '../lib/actions'
import {useEffect} from 'react'
import {Result} from './Result'

export function App() {
  const fullscreenActiveId = use.fullscreenActiveId()
  const screensaverMode = use.screensaverMode()
  const feed = use.feed()
  const activeCollectionId = use.activeCollectionId()
  const activeResultId = use.activeResultId()

  const headerHeight = use.headerHeight()

  useEffect(() => {
    function processHash() {
      const hash = window.location.hash
      if (!hash) return null

      let somethingMatched = false
      const collectionMatch = hash.match(/vibecheckcollection([^&]+)/)
      if (collectionMatch) {
        somethingMatched = true
        setActiveCollectionId(collectionMatch[1]!)
      }
      const resultMatch = hash.match(/vibecheck_([^&]+)/)
      if (resultMatch) {
        somethingMatched = true
        const stripFileExtension = (id: string) => {
          return id.replace(/\.[^/.]+$/, '')
        }
        setActiveResultId(stripFileExtension(resultMatch[0]!))
      }

      if (somethingMatched === false) {
        setActiveCollectionId(null)
        setActiveResultId(null)
      }
    }
    processHash()
    window.addEventListener('hashchange', processHash)
    return () => window.removeEventListener('hashchange', processHash)
  }, [])

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col relative min-w-0 min-h-screen border-l border-secondary">
        <div className="flex-1 flex flex-col overflow-x-hidden relative">
          {activeCollectionId ? (
          <Collection id={activeCollectionId} />
        ) : activeResultId ? (
          <Result id={activeResultId} />
        ) : feed.length === 0 ? (
          <Intro />
        ) : (
          <div className="pb-40">
            <div
              className="flex sticky w-full items-center z-40 bg-primary/95 backdrop-blur-sm py-4 justify-between text-primary px-6 pr-8 border-b border-secondary h-auto"
              style={{top: 0}}
            >
              <h2 className="text-lg font-semibold tracking-tight">Your Generations</h2>
              <button
                className="chip"
                onClick={() => {
                  initializeAudio()
                  setScreensaverMode(true)
                }}
              >
                <span className="icon">desktop_windows</span>
                Screensaver
              </button>
            </div>
            <main>
              <ul className="feed">
                {feed.map(round => (
                  <FeedItem key={round.id} round={round} />
                ))}
              </ul>
            </main>
          </div>
        )}
        </div>
        
        {/* Bottom Generation Dock */}
        <div className="sticky bottom-0 left-0 w-full z-50">
          <Header activeCollectionId={activeCollectionId} />
        </div>

        {fullscreenActiveId && <FullscreenOverlay />}
        {screensaverMode && <Screensaver />}
      </div>
    </div>
  )
}

export default App
