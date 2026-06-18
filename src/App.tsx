import { useEffect, useState } from 'react'
import { questions } from './data/questions'
import type { AnswerMap } from './lib/scoring'
import StartScreen from './components/StartScreen'
import TestScreen from './components/TestScreen'
import ResultsScreen from './components/ResultsScreen'

type Stage = 'start' | 'test' | 'results'
export type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [stage, setStage] = useState<Stage>('start')
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  function handleAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleStart() {
    setAnswers({})
    setStage('test')
  }

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  if (stage === 'start') {
    return (
      <StartScreen
        questions={questions}
        onStart={handleStart}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  if (stage === 'test') {
    return (
      <TestScreen
        questions={questions}
        answers={answers}
        onAnswer={handleAnswer}
        onSubmit={() => setStage('results')}
      />
    )
  }

  return (
    <ResultsScreen
      questions={questions}
      answers={answers}
      onRetake={handleStart}
      onHome={() => setStage('start')}
    />
  )
}

export default App
