import { useEffect, useState } from 'react'
import { questions } from './data/questions'
import type { Question } from './types'
import type { AnswerMap } from './lib/scoring'
import { prepareQuiz } from './lib/quiz'
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
  const [quiz, setQuiz] = useState<Question[]>(() => prepareQuiz(questions))
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [startTime, setStartTime] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  function handleAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleStart() {
    setQuiz(prepareQuiz(questions))
    setAnswers({})
    setStartTime(Date.now())
    setElapsedMs(0)
    setStage('test')
  }

  function handleSubmit() {
    setElapsedMs(Date.now() - startTime)
    setStage('results')
  }

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  if (stage === 'start') {
    return (
      <StartScreen
        questions={quiz}
        onStart={handleStart}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  if (stage === 'test') {
    return (
      <TestScreen
        questions={quiz}
        answers={answers}
        onAnswer={handleAnswer}
        onSubmit={handleSubmit}
        startTime={startTime}
      />
    )
  }

  return (
    <ResultsScreen
      questions={quiz}
      answers={answers}
      elapsedMs={elapsedMs}
      onRetake={handleStart}
      onHome={() => setStage('start')}
    />
  )
}

export default App
