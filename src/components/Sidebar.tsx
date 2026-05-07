import {use} from '../lib/store'
import {useTheme} from '../lib/useTheme'

export function Sidebar() {
  const {theme, toggleTheme} = useTheme()
  const userRounds = use.userRounds()
  const setActiveCollectionId = use.activeCollectionId.set
  const setFeed = use.feed.set
  const activeCollectionId = use.activeCollectionId()

  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-secondary bg-primary flex flex-col pt-8 pb-4 shrink-0 h-auto md:h-screen sticky top-0 overflow-y-auto z-50">
      <div className="px-6 mb-8 flex flex-col gap-1 items-start">
        <h1 className="text-2xl font-black uppercase tracking-tighter" style={{
          backgroundSize: '100% 500%',
          backgroundImage: 'linear-gradient(0deg, #4158d0 0%, #c850c0 25%, #ffcc70 50%, #c850c0 75%, #4158d0 100%)',
          color: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientFlow 10s ease infinite alternate',
          lineHeight: '1.2',
          cursor: 'pointer'
        }}
        onClick={() => {
          setActiveCollectionId(null)
          setFeed([])
        }}>
          Thumbnail<span className="text-primary text-sm relative -top-1 ml-1" style={{color: 'var(--text-primary)'}}>🖼️</span><br />
          Safi
        </h1>
      </div>

      <nav className="flex flex-row md:flex-col gap-2 px-4 md:px-0 scrollbar-hide overflow-x-auto md:overflow-hidden pb-2 md:pb-0">
        <button
          className={`flex items-center gap-3 px-6 py-3 text-left w-full hover:bg-neutral-500/10 transition-colors ${!activeCollectionId ? 'font-bold' : ''}`}
          onClick={() => {
            setActiveCollectionId(null)
          }}
        >
          <span className="icon">home</span>
          <span className="text-sm">Home</span>
        </button>

        <button
          className="flex items-center justify-between gap-3 px-6 py-3 text-left w-full hover:bg-neutral-500/10 transition-colors group"
          onClick={() => {
            setActiveCollectionId(null)
            setFeed(userRounds)
          }}
        >
          <div className="flex items-center gap-3">
            <span className="icon">person</span>
            <span className="text-sm">Your Generations</span>
          </div>
          <span className="bg-neutral-500/20 text-xs px-2 py-0.5 rounded-full font-mono">{userRounds.length}</span>
        </button>
      </nav>

      <div className="mt-auto px-6 pt-4 flex items-center justify-between">
        <span className="text-sm text-tertiary font-medium">Theme</span>
        <button
          className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-neutral-500/20 transition-colors"
          onClick={toggleTheme}
          style={{ fontSize: '20px' }}
        >
          <span className="icon">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </div>
  )
}
