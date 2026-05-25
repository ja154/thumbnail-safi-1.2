import {use} from '../lib/store'
import {useTheme} from '../lib/useTheme'

export function Sidebar() {
  const {theme, toggleTheme} = useTheme()
  const userRounds = use.userRounds()
  const setActiveCollectionId = use.activeCollectionId.set
  const setFeed = use.feed.set
  const activeCollectionId = use.activeCollectionId()

  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border-primary bg-bg-primary flex flex-col pt-6 shrink-0 h-auto md:h-screen sticky top-0 overflow-y-auto z-50">
      <div className="px-6 mb-8 flex flex-col gap-1 items-start">
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
          <span className="text-xl font-medium text-accent">Safi</span>
        </h1>
      </div>

      <div className="flex flex-col gap-6 px-4 flex-1">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-text-tertiary mb-3 px-2">Tools</div>
          <nav className="flex flex-col gap-1">
            <button
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left w-full transition-colors ${!activeCollectionId && userRounds !== use.feed() ? 'bg-bg-secondary text-text-primary font-medium' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'}`}
              onClick={() => {
                setActiveCollectionId(null)
                setFeed([])
              }}
            >
              <span className="icon text-lg">edit</span>
              <span className="text-[15px]">Creator</span>
            </button>
            <button
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left w-full transition-colors group ${activeCollectionId === null && userRounds === use.feed() ? 'bg-bg-secondary text-text-primary font-medium' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'}`}
              onClick={() => {
                setActiveCollectionId(null)
                setFeed(userRounds)
              }}
            >
              <div className="flex items-center gap-3">
                <span className="icon text-lg">history</span>
                <span className="text-[15px]">History</span>
              </div>
              <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs font-mono font-medium">{userRounds.length}</span>
            </button>
          </nav>
        </div>

        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-text-tertiary mb-3 px-2">Library</div>
          <nav className="flex flex-col gap-1">
             <button
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-left w-full transition-colors text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
            >
              <span className="icon text-lg">folder</span>
              <span className="text-[15px]">Assets</span>
            </button>
            <button
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-left w-full transition-colors text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
            >
              <span className="icon text-lg">favorite</span>
              <span className="text-[15px]">Favorites</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-auto border-t border-border-primary p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
              U
            </div>
            <div className="flex-col overflow-hidden hidden md:flex">
              <span className="text-sm font-medium text-text-primary truncate">User Profile</span>
              <span className="text-xs text-text-tertiary truncate">Pro Plan</span>
            </div>
          </div>
          <button
            className="rounded-full w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors shrink-0"
            onClick={toggleTheme}
          >
            <span className="icon text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
