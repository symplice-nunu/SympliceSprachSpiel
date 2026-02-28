import { LEVELS, STORAGE_KEY } from '../constants.js'

export const initialProgress = {
  stats: LEVELS.reduce(
    (acc, level) => ({
      ...acc,
      [level]: {
        flashcardsSeen: 0,
        flashcardsKnown: 0,
        quizPlayed: 0,
        quizCorrect: 0,
        currentFlashcardIndex: 0,
        currentQuizIndex: 0,
      },
    }),
    {},
  ),
}


export function loadProgress() {
  try {
    if (typeof window === 'undefined') return initialProgress
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialProgress
    const parsed = JSON.parse(raw)
    return { ...initialProgress, ...parsed }
  } catch {
    return initialProgress
  }
}


export function saveProgress(progress) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // ignore write failures
  }
}

