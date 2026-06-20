import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Question, Section } from '../types'
import { SECTION_LABELS } from '../types'
import type { Theme } from '../App'
import {
  checkAdmin,
  createQuestion,
  deleteQuestion,
  fetchQuestions,
  updateQuestion,
  type NewQuestion,
} from '../lib/api'
import {
  clearAdminPassword,
  getAdminPassword,
  setAdminPassword,
} from '../lib/auth'
import ThemeToggle from './ThemeToggle'
import QuestionForm from './QuestionForm'
import PdfImport from './PdfImport'

type Props = {
  theme: Theme
  onToggleTheme: () => void
}

export default function Dashboard({ theme, onToggleTheme }: Props) {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  // On mount, try the stored password (if any) so a refresh stays logged in.
  useEffect(() => {
    let active = true
    checkAdmin()
      .then(() => {
        if (active) setAuthed(true)
      })
      .catch(() => {
        /* not authenticated yet */
      })
      .finally(() => {
        if (active) setChecking(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (checking) {
    return (
      <Shell theme={theme} onToggleTheme={onToggleTheme} authed={false} onLogout={() => {}}>
        <p className="text-center text-slate-500 dark:text-slate-400">Loading…</p>
      </Shell>
    )
  }

  if (!authed) {
    return (
      <Shell theme={theme} onToggleTheme={onToggleTheme} authed={false} onLogout={() => {}}>
        <LoginGate onSuccess={() => setAuthed(true)} />
      </Shell>
    )
  }

  return (
    <Shell
      theme={theme}
      onToggleTheme={onToggleTheme}
      authed
      onLogout={() => {
        clearAdminPassword()
        setAuthed(false)
      }}
    >
      <AdminPanel />
    </Shell>
  )
}

/** Page chrome shared by every dashboard state. */
function Shell({
  theme,
  onToggleTheme,
  authed,
  onLogout,
  children,
}: {
  theme: Theme
  onToggleTheme: () => void
  authed: boolean
  onLogout: () => void
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <Link
              to="/"
              className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              ← Back to site
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {authed && (
              <button
                onClick={onLogout}
                className="text-sm font-semibold text-slate-500 transition hover:text-rose-600 dark:text-slate-400"
              >
                Log out
              </button>
            )}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  )
}

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState(getAdminPassword())
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setAdminPassword(password)
    try {
      await checkAdmin()
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
      clearAdminPassword()
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <h2 className="text-center text-xl font-bold">Admin access</h2>
      <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
        Enter the admin password to manage questions.
      </p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
        className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      />
      {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {busy ? 'Checking…' : 'Sign in'}
      </button>
    </form>
  )
}

type Tab = 'manage' | 'add'

function AdminPanel() {
  const [tab, setTab] = useState<Tab>('manage')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadError, setLoadError] = useState('')

  const loadQuestions = useCallback(async () => {
    try {
      setQuestions(await fetchQuestions())
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load questions.')
    }
  }, [])

  // Initial load (inline so no setState runs synchronously in the effect body).
  useEffect(() => {
    let active = true
    fetchQuestions()
      .then((q) => {
        if (active) setQuestions(q)
      })
      .catch((err: unknown) => {
        if (active) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load questions.')
        }
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <div className="mb-6 inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
        <TabButton active={tab === 'manage'} onClick={() => setTab('manage')}>
          Manage ({questions.length})
        </TabButton>
        <TabButton active={tab === 'add'} onClick={() => setTab('add')}>
          Add questions
        </TabButton>
      </div>

      {loadError && (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {loadError}
        </p>
      )}

      {tab === 'manage' ? (
        <ManageTab questions={questions} onChanged={loadQuestions} />
      ) : (
        <AddTab onSaved={loadQuestions} />
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-indigo-600 text-white'
          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function ManageTab({
  questions,
  onChanged,
}: {
  questions: Question[]
  onChanged: () => Promise<void>
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | Section>('all')

  const counts = {
    all: questions.length,
    'reading-writing': questions.filter((q) => q.section === 'reading-writing').length,
    math: questions.filter((q) => q.section === 'math').length,
  }
  const visible = filter === 'all' ? questions : questions.filter((q) => q.section === filter)

  if (questions.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        No questions yet. Use “Add questions” to create some.
      </p>
    )
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this question? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteQuestion(id)
      await onChanged()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* Section filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          All ({counts.all})
        </FilterButton>
        <FilterButton
          active={filter === 'reading-writing'}
          onClick={() => setFilter('reading-writing')}
        >
          Reading &amp; Writing ({counts['reading-writing']})
        </FilterButton>
        <FilterButton active={filter === 'math'} onClick={() => setFilter('math')}>
          Math ({counts.math})
        </FilterButton>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          No questions in this section.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
          {editingId === q.id ? (
            <QuestionForm
              initial={q}
              submitLabel="Save changes"
              onCancel={() => setEditingId(null)}
              onSubmit={async (input: NewQuestion) => {
                await updateQuestion(q.id, input)
                await onChanged()
              }}
            />
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                  <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {SECTION_LABELS[q.section]}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                    {q.type === 'grid-in' ? 'Grid-in' : 'Multiple choice'}
                  </span>
                  {q.domain && (
                    <span className="text-slate-400 dark:text-slate-500">{q.domain}</span>
                  )}
                </div>
                <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                  {q.prompt}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Answer:{' '}
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {q.type === 'multiple-choice'
                      ? `${q.correctAnswer}. ${
                          q.choices?.find((c) => c.label === q.correctAnswer)?.text ?? ''
                        }`
                      : (q.acceptedAnswers ?? [q.correctAnswer]).join(' / ')}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setEditingId(q.id)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  disabled={deletingId === q.id}
                  className="rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-40 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  {deletingId === q.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? 'border-indigo-600 bg-indigo-600 text-white'
          : 'border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500'
      }`}
    >
      {children}
    </button>
  )
}

function AddTab({ onSaved }: { onSaved: () => Promise<void> }) {
  const [mode, setMode] = useState<'manual' | 'pdf'>('manual')

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-6 inline-flex rounded-lg border border-slate-200 p-1 dark:border-slate-700">
        <TabButton active={mode === 'manual'} onClick={() => setMode('manual')}>
          Manual entry
        </TabButton>
        <TabButton active={mode === 'pdf'} onClick={() => setMode('pdf')}>
          Upload PDF
        </TabButton>
      </div>

      {mode === 'manual' ? (
        <QuestionForm
          submitLabel="Save question"
          onSubmit={async (input: NewQuestion) => {
            await createQuestion(input)
            await onSaved()
          }}
        />
      ) : (
        <PdfImport onSaved={onSaved} />
      )}
    </div>
  )
}
