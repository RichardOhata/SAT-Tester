export type Section = 'reading-writing' | 'math'

export type Choice = {
  label: 'A' | 'B' | 'C' | 'D'
  text: string
}

export type TableData = {
  headers: string[]
  rows: string[][]
  caption?: string
  note?: string
}

export type Question = {
  id: string
  section: Section
  /** Display number within its section (1-based). */
  number: number
  type: 'multiple-choice' | 'grid-in'
  /** Stimulus: passage, scenario, or equation setup shown above the prompt. */
  passage?: string
  /** Optional rendered data table (e.g. the robots-by-occupation table). */
  table?: TableData
  /** Optional figure image — an external URL or a base64 data URL. */
  imageUrl?: string
  /** Optional text description of an accompanying graph/figure (caption/fallback). */
  figureNote?: string
  /** The actual question being asked. */
  prompt: string
  /** Present for multiple-choice questions. */
  choices?: Choice[]
  /** Canonical correct answer (a choice label for MC; a value string for grid-in). */
  correctAnswer: string
  /**
   * For grid-in questions, every accepted answer form, pre-normalized to lower
   * case with spaces removed and the unicode minus replaced by '-'.
   */
  acceptedAnswers?: string[]
  explanation: string
  domain: string
  skill: string
}

export const SECTION_LABELS: Record<Section, string> = {
  'reading-writing': 'Reading & Writing',
  math: 'Math',
}
