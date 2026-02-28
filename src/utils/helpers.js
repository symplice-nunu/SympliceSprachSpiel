import { QUIZ_QUESTIONS_PER_SET } from '../constants.js'
import { WORD_SETS } from '../data/flashcards.js'

export function chunkArray(arr, size) {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

export function getQuizzesForLevel(level) {
  const quizArr = WORD_SETS[level]?.quiz ?? []
  return chunkArray(quizArr, QUIZ_QUESTIONS_PER_SET).map((questions, i) => ({
    id: String(i + 1),
    name: `Quiz ${i + 1}`,
    questions,
  }))
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
