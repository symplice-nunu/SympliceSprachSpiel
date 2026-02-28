import { useCallback, useMemo, useState } from 'react'
import { useEffect } from 'react'
import { getQuizzesForLevel, shuffleArray, calculatePercentage } from '../utils/helpers.js'

function QuizGame({ level, onAnswer, stats }) {
  const allQuizzes = useMemo(() => getQuizzesForLevel(level), [level])
  const [selectedQuizId, setSelectedQuizId] = useState('1')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [answered, setAnswered] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const currentQuiz = allQuizzes.find((q) => q.id === selectedQuizId) ?? allQuizzes[0]
  const questions = currentQuiz?.questions ?? []

  useEffect(() => {
    setSelectedQuizId('1')
    setIndex(0)
    setSelected('')
    setAnswered(false)
    setCompleted(false)
    setCorrectCount(0)
  }, [level])

  useEffect(() => {
    setIndex(0)
    setSelected('')
    setAnswered(false)
    setCompleted(false)
    setCorrectCount(0)
  }, [selectedQuizId])

  const q = questions[index]

  if (!q) {
    return (
      <div className="rounded-3xl bg-gray-800 p-8 text-center text-gray-400">
        No quiz questions available. Try another level.
      </div>
    )
  }

  const shuffledOptions = useMemo(
    () => shuffleArray(q.options),
    [index, selectedQuizId],
  )

  const submit = () => {
    if (!selected || answered) return
    const isCorrect = selected === q.correct
    setAnswered(true)
    if (isCorrect) {
      setCorrectCount((c) => c + 1)
    }
    onAnswer(isCorrect)
    if (index === questions.length - 1) {
      setCompleted(true)
    }
  }

  const next = () => {
    if (index === questions.length - 1) {
      setCompleted(true)
      return
    }
    setSelected('')
    setAnswered(false)
    setIndex((i) => i + 1)
  }

  const restart = () => {
    setIndex(0)
    setSelected('')
    setAnswered(false)
    setCompleted(false)
    setCorrectCount(0)
  }

  return (
    <div className="flex flex-col gap-6">
      {allQuizzes.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Select quiz:</span>
          <div className="inline-flex gap-1.5 rounded-xl bg-gray-800/50 p-1.5 backdrop-blur-sm">
            {allQuizzes.map((quiz) => (
              <button
                key={quiz.id}
                type="button"
                onClick={() => setSelectedQuizId(quiz.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedQuizId === quiz.id
                    ? 'bg-gray-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                }`}
              >
                {quiz.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl bg-gray-800 p-8 shadow-2xl">
        <div className={'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'} />

        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300">
              {currentQuiz?.name} · Question {index + 1}/{questions.length}
            </span>
          </div>

          <p className="mb-6 text-xl font-medium text-white">{q.question}</p>

          <div className="space-y-3">
            {shuffledOptions.map((option) => {
              const isSelected = option === selected
              const isCorrect = option === q.correct

              let buttonClasses = "w-full text-left rounded-xl border-2 p-4 transition-all duration-300"

              if (answered) {
                if (isCorrect) {
                  buttonClasses += " border-green-500 bg-green-500/20 text-green-200"
                } else if (isSelected && !isCorrect) {
                  buttonClasses += " border-red-500 bg-red-500/20 text-red-200"
                } else {
                  buttonClasses += " border-gray-700 text-gray-400 opacity-50"
                }
              } else {
                buttonClasses += isSelected
                  ? " border-gray-400 bg-gray-700/50 text-white"
                  : " border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-700/30"
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => setSelected(option)}
                  className={buttonClasses}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-current text-xs">
                      {String.fromCharCode(65 + shuffledOptions.indexOf(option))}
                    </span>
                    {option}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={submit}
          disabled={!selected || answered}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-gray-900/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="absolute inset-0 bg-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            Check answer
          </span>
        </button>

        {answered && !completed && (
          <button
            type="button"
            onClick={next}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-700 px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="absolute inset-0 bg-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2">
              Next question &rarr;
            </span>
          </button>
        )}
      </div>

      {completed && (
        <div className="rounded-3xl bg-gray-900/70 p-6 text-center shadow-xl">
          <h2 className="mb-3 text-2xl font-bold text-white">Quiz complete!</h2>
          <p className="mb-2 text-sm text-gray-200">
            You answered{' '}
            <span className="font-semibold text-white">{correctCount}</span> out of{' '}
            <span className="font-semibold text-white">{questions.length}</span> questions correctly.
          </p>
          <p className="mb-6 text-sm text-gray-400">
            Your score:{' '}
            <span className="font-semibold text-white">
              {calculatePercentage(correctCount, questions.length)}%
            </span>
          </p>
          {stats && (
            <div className="mb-6 text-xs text-gray-400">
              Total answered so far:{' '}
              <span className="font-semibold text-gray-200">{stats.quizPlayed}</span> · Total correct:{' '}
              <span className="font-semibold text-gray-200">{stats.quizCorrect}</span> · Overall accuracy:{' '}
              <span className="font-semibold text-gray-200">
                {calculatePercentage(stats.quizCorrect, stats.quizPlayed)}%
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center justify-center rounded-xl bg-gray-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-900/30 transition-all duration-300 hover:scale-105 hover:bg-gray-500"
          >
            Restart quiz
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizGame
