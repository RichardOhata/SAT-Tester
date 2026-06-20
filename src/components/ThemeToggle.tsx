import type { Theme } from '../App'

type Props = {
  theme: Theme
  onToggle: () => void
}

/** Light/dark switch. The page-wide color fade is handled in index.css. */
export default function ThemeToggle({ theme, onToggle }: Props) {
  const isDark = theme === 'dark'
  return (
    <button
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-lg shadow-sm transition hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500"
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}
