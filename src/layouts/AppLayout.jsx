import { useCallback, useState } from 'react'
import { WORD_SETS } from '../data/flashcards.js'
import { useGameProgress } from '../hooks/useGameProgress.js'
import { calculatePercentage } from '../utils/helpers.js'
import ErrorBoundary from '../components/ErrorBoundary.jsx'
import LevelSelector from '../components/LevelSelector.jsx'
import ProgressBadges from '../components/ProgressBadges.jsx'
import FlashcardGame from '../components/FlashcardGame.jsx'
import QuizGame from '../components/QuizGame.jsx'
import VideosTab from '../components/VideosTab.jsx'

const NAV_TABS = [
  {
    id: 'videos',
    label: 'Videos',
    icon: (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  { id: 'flashcards', label: 'Flashcards', icon: null },
  { id: 'quiz', label: 'Quiz', icon: null },
]

function AppLayout() {
  const { progress, updateLevel } = useGameProgress()
  const [level, setLevel] = useState('A1')
  const [activeTab, setActiveTab] = useState('videos')

  const currentStats = progress.stats[level]

  const handleSeenWord = useCallback(() => {
    updateLevel(level, (s) => ({ ...s, flashcardsSeen: s.flashcardsSeen + 1 }))
  }, [level, updateLevel])

  const handleKnownWord = useCallback(() => {
    updateLevel(level, (s) => ({ ...s, flashcardsKnown: s.flashcardsKnown + 1 }))
  }, [level, updateLevel])

  const handleFlashcardIndexChange = useCallback(
    (newIndex) => {
      updateLevel(level, (s) => ({ ...s, currentFlashcardIndex: newIndex }))
    },
    [level, updateLevel],
  )

  const handleQuizAnswer = useCallback(
    (isCorrect) => {
      updateLevel(level, (s) => ({
        ...s,
        quizPlayed: s.quizPlayed + 1,
        quizCorrect: s.quizCorrect + (isCorrect ? 1 : 0),
      }))
    },
    [level, updateLevel],
  )

  function renderTab() {
    if (activeTab === 'flashcards') {
      return (
        <FlashcardGame
          level={level}
          stats={currentStats}
          onSeenWord={handleSeenWord}
          onKnownWord={handleKnownWord}
          onIndexChange={handleFlashcardIndexChange}
        />
      )
    }
    if (activeTab === 'quiz') {
      return (
        <QuizGame
          level={level}
          stats={currentStats}
          onAnswer={handleQuizAnswer}
        />
      )
    }
    return <VideosTab level={level} />
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className={'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'} />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-bold text-white">
                German Learning
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Learn German with Play
            </h1>
            <p className="mt-2 max-w-2xl text-gray-400">
              Practice vocabulary and grammar with interactive flashcards and quizzes.
              Progress is saved automatically in your browser.
            </p>
          </div>
          <LevelSelector currentLevel={level} onSelect={setLevel} />
        </header>

        <main className="grid gap-8 lg:grid-cols-[1fr,320px]">
          <section className="space-y-6">
            <nav className="flex w-full gap-2 rounded-2xl bg-gray-800/50 p-1.5 backdrop-blur-sm">
              {NAV_TABS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex-1 rounded-xl py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeTab === id ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {activeTab === id && (
                    <span className="absolute inset-0 rounded-xl bg-gray-600" />
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    {icon}
                    {label}
                  </span>
                </button>
              ))}
            </nav>

            <ErrorBoundary>
              {renderTab()}
            </ErrorBoundary>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-gray-800/30 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white">Your Progress</h2>
              <p className="mt-1 text-sm text-gray-400">
                Track your learning journey
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-300">Flashcards</span>
                    <span className="font-medium text-white">
                      {currentStats.flashcardsKnown} / {currentStats.flashcardsSeen || WORD_SETS[level].flashcards.length}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gray-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, calculatePercentage(currentStats.flashcardsKnown, currentStats.flashcardsSeen))}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-300">Quiz Accuracy</span>
                    <span className="font-medium text-white">
                      {currentStats.quizPlayed
                        ? `${calculatePercentage(currentStats.quizCorrect, currentStats.quizPlayed)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gray-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, calculatePercentage(currentStats.quizCorrect, currentStats.quizPlayed))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <ProgressBadges stats={progress.stats} />
            </div>

            <div className="rounded-2xl bg-gray-800/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                Study Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  Say each German word out loud three times
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  Create your own sentences with new words
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  Practice daily for best results
                </li>
              </ul>
            </div>
          </aside>
        </main>

        <footer className="mt-12 flex items-center justify-between border-t border-gray-800 pt-6 text-xs text-gray-500">
          <span>&#x2728; Progress saved locally in your browser</span>
          <span>Based on CEFR levels: A1 &middot; A2 &middot; B1</span>
        </footer>
      </div>
    </div>
  )
}

export default AppLayout
