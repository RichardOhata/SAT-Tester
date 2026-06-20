import { useCallback, useEffect, useState } from 'react'
import type { Question } from '../types'
import type { Theme } from '../App'
import type { AnswerMap } from '../lib/scoring'
import { fetchQuestions } from '../lib/api'
import { prepareQuiz } from '../lib/quiz'
import StartScreen from './StartScreen'
import TestScreen from './TestScreen'
import ResultsScreen from './ResultsScreen'

type Stage = 'start' | 'test' | 'results'

type Props = {
  theme: Theme
  onToggleTheme: () => void
}

export default function QuizApp({ theme, onToggleTheme }: Props) {
  const [stage, setStage] = useState<Stage>('start')
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<Question[]>([])
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [startTime, setStartTime] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)

  // Reusable refresh for the retry button.
  const loadQuestions = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      setAllQuestions(await fetchQuestions())
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load questions.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load on mount (no synchronous setState — updates run in callbacks).
  useEffect(() => {
    let active = true
    fetchQuestions()
      .then((q) => {
        if (active) setAllQuestions(q)
      })
      .catch((err: unknown) => {
        if (active) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load questions.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  function handleAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleStart() {
    setQuiz(prepareQuiz(allQuestions))
    setAnswers({})
    setStartTime(Date.now())
    setElapsedMs(0)
    setStage('test')
  }

  function handleSubmit() {
    setElapsedMs(Date.now() - startTime)
    setStage('results')
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

  if (stage === 'results') {
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

  return (
    <StartScreen
      questions={allQuestions}
      loading={loading}
      loadError={loadError}
      onRetry={loadQuestions}
      onStart={handleStart}
      theme={theme}
      onToggleTheme={onToggleTheme}
    />
  )
}
