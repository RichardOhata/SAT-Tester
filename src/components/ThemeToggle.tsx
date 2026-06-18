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
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
    >
      <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
