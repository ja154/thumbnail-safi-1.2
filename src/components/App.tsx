/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
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
import {Workspace} from './Workspace'

export function App() {
  const fullscreenActiveId = use.fullscreenActiveId()
  const screensaverMode = use.screensaverMode()
  const feed = use.feed()
  const userRounds = use.userRounds()
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
    <div className="flex flex-col md:flex-row min-h-screen relative w-full h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative min-w-0 h-full border-l border-border-primary bg-bg-primary overflow-y-auto">
        <div className="flex-1 flex flex-col overflow-x-hidden relative h-full">
          {activeCollectionId ? (
          <Collection id={activeCollectionId} />
        ) : activeResultId ? (
          <Result id={activeResultId} />
        ) : feed !== userRounds || feed.length === 0 ? (
          <Workspace />
        ) : (
          <div className="pb-40">
            <div
              className="flex sticky w-full items-center z-40 bg-bg-primary/95 backdrop-blur-md py-4 justify-between text-text-primary px-6 pr-8 border-b border-border-primary h-auto"
              style={{top: 0}}
            >
              <h2 className="text-xl font-bold tracking-tight text-text-primary">Generation History</h2>
              <button
                className="chip primary flex items-center gap-2 px-4 py-2 hover:brightness-110 transition-all font-medium text-sm"
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

        {fullscreenActiveId && <FullscreenOverlay />}
        {screensaverMode && <Screensaver />}
      </div>
    </div>
  )
}

export default App
