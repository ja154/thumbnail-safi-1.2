import {use} from '../lib/store'
import {useTheme} from '../lib/useTheme'

export function Sidebar() {
  const {theme, toggleTheme} = useTheme()
  const userRounds = use.userRounds()
  const setActiveCollectionId = use.activeCollectionId.set
  const setFeed = use.feed.set
  const activeCollectionId = use.activeCollectionId()

  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border-primary bg-bg-primary flex flex-col pt-8 pb-4 shrink-0 h-auto md:h-screen sticky top-0 overflow-y-auto z-50">
      <div className="px-6 mb-8 mt-2 flex flex-col gap-1 items-start">
        <h1 
          className="text-2xl font-bold tracking-tighter cursor-pointer flex flex-col items-start leading-[1.1] text-text-primary transition-opacity hover:opacity-80"
          onClick={() => {
            setActiveCollectionId(null)
            setFeed([])
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[26px]">Thumbnail</span>
          </div>
          <span className="text-xl font-medium text-text-tertiary">Safi</span>
        </h1>
      </div>

      <nav className="flex flex-row md:flex-col gap-1 px-4 md:px-3 scrollbar-hide overflow-x-auto md:overflow-hidden pb-2 md:pb-0">
        <button
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left w-full transition-colors ${!activeCollectionId && userRounds !== use.feed() ? 'bg-bg-secondary text-text-primary font-medium' : 'text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary'}`}
          onClick={() => {
            setActiveCollectionId(null)
            setFeed([])
          }}
        >
          <span className="icon text-lg">home</span>
          <span className="text-[15px]">Home</span>
        </button>

        <button
          className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left w-full transition-colors group ${activeCollectionId === null && userRounds === use.feed() ? 'bg-bg-secondary text-text-primary font-medium' : 'text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary'}`}
          onClick={() => {
            setActiveCollectionId(null)
            setFeed(userRounds)
          }}
        >
          <div className="flex items-center gap-3">
            <span className="icon text-lg">person</span>
            <span className="text-[15px]">Your Generations</span>
          </div>
          <span className="bg-bg-quaternary text-text-secondary px-2 py-0.5 rounded-md text-xs font-mono">{userRounds.length}</span>
        </button>
      </nav>

      <div className="mt-auto px-6 pt-4 flex items-center justify-between border-t border-border-secondary pt-6 mx-4">
        <span className="text-sm text-text-tertiary font-medium">Theme</span>
        <button
          className="rounded-full w-9 h-9 flex items-center justify-center bg-bg-secondary text-text-primary hover:bg-bg-tertiary transition-colors border border-border-primary"
          onClick={toggleTheme}
        >
          <span className="icon text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </div>
  )
}
