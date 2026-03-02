import { QUIZZES } from '../data/quizzes.js'

export function getQuizzesForLevel(level) {
  return QUIZZES[level] ?? []
}

/** Unbiased Fisher-Yates shuffle. .sort(() => Math.random() - 0.5) has statistical bias. */
export function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Returns a rounded percentage, or 0 when total is falsy. */
export function calculatePercentage(value, total) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}
