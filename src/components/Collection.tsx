/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useState, useEffect} from 'react'
import {
  setActiveCollectionId,
  setFeed,
  setScreensaverMode
} from '../lib/actions'
import FeedItem from './FeedItem'
import type {Round} from '../lib/types'
import {initializeAudio} from '../lib/useTonePalette'
import {use} from '../lib/store'

interface Collection {
  id: string
  name: string
  slug: string
  shareIds: string
  isActive: boolean
  isDeleted: boolean
  sortOrder: number
}
type CloudCollectionData = {
  collection: Collection
  rounds: Round[]
}

export function Collection({id}: {id: string}) {
  const [rounds, setRounds] = useState<Round[]>([])
  const [collectionData, setCollectionData] = useState<Collection | null>(null)
  const headerHeight = use.headerHeight()
  const [collections, setCollections] = useState<Collection[]>([])
  const [shareCopied, setShareCopied] = useState(false)

  // Main fetch
  useEffect(() => {
    async function loadCollection() {
      const colRes = await fetch(
        `https://storage.googleapis.com/experiments-uploads/vibecheck/${id}.json`
      )
      const colData = (await colRes.json()) as CloudCollectionData
      setRounds(colData.rounds)
      setCollectionData(colData.collection)
    }
    loadCollection()
  }, [id])

  // All collections - hopefully cached
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        'https://storage.googleapis.com/experiments-uploads/vibecheck/active.json'
      )
      const collectionIds = await res.json()

      // fetch each collection from google storage
      const collectionsData: Collection[] = []
      for (const collectionId of collectionIds) {
        const colRes = await fetch(
          `https://storage.googleapis.com/experiments-uploads/vibecheck/${collectionId}.json`
        )
        const colData = (await colRes.json()) as CloudCollectionData
        collectionsData.push(colData.collection)
      }
      setCollections(collectionsData)
    }
    fetchData()
  }, [])

  // Update feed for screensaver and fullscreen
  useEffect(() => {
    setFeed(rounds)
  }, [rounds])

  if (!collectionData) {
    return null
  }

  return (
    <div>
      <div
        className="flex sticky w-full z-40 bg-bg-primary/95 backdrop-blur-md py-4 justify-between text-text-primary px-6 pr-8 border-b border-border-primary h-auto"
        style={{top: `${headerHeight}px`}}
      >
        <div className="flex gap-3 items-center">
          <span className="text-text-tertiary font-medium">Collection /</span>
          <div className="selectorWrapper shorter">
            <select
              value={collectionData.id}
              onChange={e => {
                // setParam('collection', e.target.value)
                setActiveCollectionId(e.target.value)
              }}
              className="bg-bg-secondary border border-border-secondary rounded-lg text-text-primary text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              style={{
                padding: '6px 32px 6px 12px',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '16px'
              }}
            >
              {collections
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(col => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors border border-border-secondary"
            onClick={() => {
              setShareCopied(true)
              const newUrl = `https://aistudio.google.com/apps/bundled/vibecheck?showPreview=true&appParams=vibecheckcollection${collectionData.id}`
              navigator.clipboard.writeText(newUrl)
              setTimeout(() => setShareCopied(false), 1000)
            }}
          >
            <span className="icon text-[18px]">share</span>
            <span className="tooltip">
              {shareCopied ? 'Copied!' : 'Copy share link'}
            </span>
          </button>

          <button
            className="chip primary flex items-center gap-2 px-4 py-2 hover:brightness-110 transition-all font-medium text-sm"
            onClick={() => {
              initializeAudio()
              setScreensaverMode(true)
            }}
          >
            <span className="icon text-[18px]">desktop_windows</span>
            Screensaver
          </button>
        </div>
      </div>

      <div>
        <main>
          <ul className="feed">
            {rounds.map(round => (
              <FeedItem
                key={round.id}
                round={round}
                showOnlyFavorited={round.favoritesOnly}
              />
            ))}
          </ul>
        </main>
      </div>
    </div>
  )
}
