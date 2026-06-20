import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import QuizApp from './components/QuizApp'
import Dashboard from './components/Dashboard'

export type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <Routes>
      <Route path="/" element={<QuizApp theme={theme} onToggleTheme={toggleTheme} />} />
      <Route
        path="/dashboard"
        element={<Dashboard theme={theme} onToggleTheme={toggleTheme} />}
      />
    </Routes>
  )
}

export default App
