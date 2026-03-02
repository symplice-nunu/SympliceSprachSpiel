import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { getQuizzesForLevel, shuffleArray, calculatePercentage } from '../utils/helpers.js'
import PremiumModal from './PremiumModal.jsx'

function LockIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0v2z" />
    </svg>
  )
}

function QuizGame({ level, onAnswer, stats }) {
  const allQuizzes = useMemo(() => getQuizzesForLevel(level), [level])
  const [selectedQuizId, setSelectedQuizId] = useState(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [answered, setAnswered] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [showPremium, setShowPremium] = useState(false)

  const lockedCount = useMemo(() => allQuizzes.filter((q) => q.premium).length, [allQuizzes])

  // Default to first quiz when level changes
  useEffect(() => {
    setSelectedQuizId(allQuizzes[0]?.id ?? null)
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

  const currentQuiz = allQuizzes.find((q) => q.id === selectedQuizId) ?? allQuizzes[0]
  const questions = currentQuiz?.questions ?? []
  const q = questions[index]

  const shuffledOptions = useMemo(
    () => (q ? shuffleArray(q.options) : []),
    [index, selectedQuizId],
  )

  if (!currentQuiz) {
    return (
      <div className="rounded-3xl bg-gray-800 p-8 text-center text-gray-400">
        No quiz questions available. Try another level.
      </div>
    )
  }

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
      {/* Quiz selector */}
      {allQuizzes.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Select quiz:</span>
          <div className="flex flex-wrap gap-1.5 rounded-xl bg-gray-800/50 p-1.5 backdrop-blur-sm">
            {allQuizzes.map((quiz) => {
              const isActive = quiz.id === currentQuiz.id
              return (
                <button
                  key={quiz.id}
                  type="button"
                  onClick={() => setSelectedQuizId(quiz.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gray-600 text-white shadow-md'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                  }`}
                >
                  {quiz.premium && (
                    <span className="text-yellow-400">
                      <LockIcon />
                    </span>
                  )}
                  {quiz.name}
                </button>
              )
            })}
          </div>
          <span className="text-xs text-gray-500">
            <span className="text-yellow-400">
              <LockIcon />
            </span>{' '}
            = Premium
          </span>
        </div>
      )}

      {/* Premium wall or quiz content */}
      {currentQuiz.premium ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-gray-800 px-8 py-16 text-center shadow-2xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-700 text-yellow-400">
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0v2z" />
            </svg>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold text-white">{currentQuiz.name} is Premium</h2>
            <p className="max-w-sm text-gray-400">
              Unlock all premium quizzes across A1, A2, and B1 levels — advanced grammar, idioms,
              and professional German.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPremium(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-8 py-3 text-sm font-bold text-gray-900 shadow-lg shadow-yellow-900/30 transition-all duration-300 hover:scale-105 hover:bg-yellow-400"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
              </svg>
              Upgrade to Premium
            </button>
            <p className="text-xs text-gray-500">First 3 quizzes per level are always free</p>
          </div>
          {showPremium && (
            <PremiumModal
              lockedCount={lockedCount}
              contentLabel="quizzes"
              onClose={() => setShowPremium(false)}
            />
          )}
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-3xl bg-gray-800 p-8 shadow-2xl">
            <div className={'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'} />

            <div className="relative">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300">
                  {currentQuiz.name} · Question {index + 1}/{questions.length}
                </span>
              </div>

              <p className="mb-6 text-xl font-medium text-white">{q.question}</p>

              <div className="space-y-3">
                {shuffledOptions.map((option) => {
                  const isSelected = option === selected
                  const isCorrect = option === q.correct

                  let buttonClasses = 'w-full text-left rounded-xl border-2 p-4 transition-all duration-300'

                  if (answered) {
                    if (isCorrect) {
                      buttonClasses += ' border-green-500 bg-green-500/20 text-green-200'
                    } else if (isSelected && !isCorrect) {
                      buttonClasses += ' border-red-500 bg-red-500/20 text-red-200'
                    } else {
                      buttonClasses += ' border-gray-700 text-gray-400 opacity-50'
                    }
                  } else {
                    buttonClasses += isSelected
                      ? ' border-gray-400 bg-gray-700/50 text-white'
                      : ' border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-700/30'
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
              <span className="relative flex items-center gap-2">Check answer</span>
            </button>

            {answered && !completed && (
              <button
                type="button"
                onClick={next}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-700 px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="absolute inset-0 bg-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">Next question &rarr;</span>
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
        </>
      )}
    </div>
  )
}

export default QuizGame
