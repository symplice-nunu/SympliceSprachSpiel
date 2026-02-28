import { useCallback, useEffect, useMemo, useState } from 'react'
import { FLASHCARD_CATEGORIES, WORD_SETS } from '../data/flashcards.js'
import {
  ALL_CATEGORIES_ID,
  COPY_RESET_DELAY,
  FLIP_ANIMATION_DELAY,
  TOGGLE_ANIMATION_DELAY,
} from '../constants.js'

function FlashcardGame({ level, onKnownWord, onSeenWord, stats, onIndexChange }) {
  const allCards = WORD_SETS[level].flashcards
  const categories = FLASHCARD_CATEGORIES[level] ?? []
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORIES_ID)
  const [index, setIndex] = useState(() => (stats?.currentFlashcardIndex ?? 0))
  const [showAnswer, setShowAnswer] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedExamplePart, setCopiedExamplePart] = useState(null)

  const copyToClipboard = useCallback((text) => {
    if (typeof navigator?.clipboard?.writeText !== 'function') return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_RESET_DELAY)
    }).catch(() => {})
  }, [])

  const copyExampleToClipboard = useCallback((text, exampleIdx, part) => {
    if (typeof navigator?.clipboard?.writeText !== 'function') return
    navigator.clipboard.writeText(text).then(() => {
      setCopiedExamplePart({ index: exampleIdx, part })
      setTimeout(() => setCopiedExamplePart(null), COPY_RESET_DELAY)
    }).catch(() => {})
  }, [])

  const categoryConfig = categories.find((c) => c.id === selectedCategoryId) ?? categories[0]
  const cards = useMemo(() => {
    if (!categoryConfig || categoryConfig.count === null) return allCards
    const end = categoryConfig.start + categoryConfig.count
    return allCards.slice(categoryConfig.start, Math.min(end, allCards.length))
  }, [allCards, categoryConfig])

  useEffect(() => {
    setSelectedCategoryId(ALL_CATEGORIES_ID)
    setIndex(stats?.currentFlashcardIndex ?? 0)
    setShowAnswer(false)
  }, [level])

  useEffect(() => {
    if (selectedCategoryId === ALL_CATEGORIES_ID) {
      const nextIndex = Math.min(stats?.currentFlashcardIndex ?? 0, allCards.length - 1)
      setIndex(Math.max(0, nextIndex))
    } else {
      setIndex(0)
    }
    setShowAnswer(false)
  }, [selectedCategoryId])

  useEffect(() => {
    if (selectedCategoryId === ALL_CATEGORIES_ID) {
      const nextIndex = Math.min(stats?.currentFlashcardIndex ?? 0, allCards.length - 1)
      setIndex(Math.max(0, nextIndex))
    }
  }, [selectedCategoryId, stats?.currentFlashcardIndex, allCards.length])

  useEffect(() => {
    onSeenWord()
  }, [index, onSeenWord])

  const safeIndex = Math.min(index, Math.max(0, cards.length - 1))
  const card = cards[safeIndex]

  if (!card) {
    return (
      <div className="rounded-3xl bg-gray-800 p-8 text-center text-gray-400">
        No flashcards in this category. Try another category or level.
      </div>
    )
  }

  const viewedCount =
    stats && typeof stats.currentFlashcardIndex === 'number'
      ? stats.currentFlashcardIndex + 1
      : stats?.flashcardsSeen ?? 0

  const getGlobalIndex = (localIdx) =>
    categoryConfig?.count === null ? localIdx : (categoryConfig?.start ?? 0) + localIdx

  const goNext = () => {
    setCopied(false)
    setCopiedExamplePart(null)
    setShowAnswer(false)
    setIndex((i) => {
      const next = (i + 1) % cards.length
      if (onIndexChange) onIndexChange(getGlobalIndex(next))
      return next
    })
  }

  const goPrevious = () => {
    setCopied(false)
    setCopiedExamplePart(null)
    setIsFlipping(true)
    setTimeout(() => {
      setShowAnswer(false)
      setIndex((i) => {
        const next = (i - 1 + cards.length) % cards.length
        if (onIndexChange) onIndexChange(getGlobalIndex(next))
        return next
      })
      setIsFlipping(false)
    }, FLIP_ANIMATION_DELAY)
  }

  const handleKnown = () => {
    onKnownWord()
    goNext()
  }

  const toggleAnswer = () => {
    setIsFlipping(true)
    setTimeout(() => {
      setShowAnswer((s) => !s)
      setIsFlipping(false)
    }, TOGGLE_ANIMATION_DELAY)
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`transform transition-all duration-300 ${
          isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gray-800 p-8 shadow-2xl">
          <div className={'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'} />

          <div className="relative">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300">
                  Flashcard {safeIndex + 1}/{cards.length}
                </span>
                <span className="text-sm text-gray-400">Level {level}</span>
                {categories.length > 1 && (
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="rounded-lg border-0 bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-200 focus:ring-2 focus:ring-gray-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <p className="text-4xl font-bold text-white">{card.de}</p>
              <button
                type="button"
                onClick={() => copyToClipboard(card.de)}
                title="Copy German word"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  copied
                    ? 'bg-green-600/30 text-green-300'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {copied ? (
                  <>
                    <span aria-hidden>&#x2713;</span>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden>&#x2398;</span>
                    <span>Copy</span>
                  </>
                )}
              </button>
              <a
                href={`https://translate.google.com/?sl=de&tl=en&text=${encodeURIComponent(card.de)}&op=translate`}
                title="Open in Google Translate"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-gray-600 hover:text-white"
              >
                <span aria-hidden>&#x1F310;</span>
                <span>Translate</span>
              </a>
            </div>

            {showAnswer ? (
              <div className="space-y-4 animate-fade-in">
                <div className="rounded-xl bg-gray-700/50 p-4">
                  <p className="text-lg text-gray-200">{card.en}</p>
                  {card.hint && (
                    <p className="mt-2 text-sm text-gray-400">
                      {card.hint}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {card.examples && card.examples.length > 0 && (
                  <div className="space-y-3">
                    {(card.gender || card.plural) && (
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                        {card.gender && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-700/70 px-2.5 py-1 text-xs font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            <span>Gender: {card.gender}</span>
                          </span>
                        )}
                        {card.plural && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-700/70 px-2.5 py-1 text-xs font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            <span>Plural: {card.plural}</span>
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Examples
                    </p>
                    {card.examples.map((example, idx) => {
                      const deCopied = copiedExamplePart?.index === idx && copiedExamplePart?.part === 'de'
                      const enCopied = copiedExamplePart?.index === idx && copiedExamplePart?.part === 'en'
                      return (
                        <div key={idx} className="rounded-lg bg-gray-700/30 p-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="text-gray-200 min-w-0 max-w-full">{example.de}</p>
                            <div className="flex flex-shrink-0 flex-grow-0 items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => copyExampleToClipboard(example.de, idx, 'de')}
                                title="Copy German example"
                                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                                  deCopied
                                    ? 'bg-green-600/30 text-green-300'
                                    : 'bg-gray-600/80 text-gray-300 hover:bg-gray-600 hover:text-white'
                                }`}
                              >
                                {deCopied ? '\u2713 Copied!' : '\u2398 Copy'}
                              </button>
                              <a
                                href={`https://translate.google.com/?sl=de&tl=en&text=${encodeURIComponent(example.de)}&op=translate`}
                                title="Open German example in Google Translate"
                                className="inline-flex items-center gap-1 rounded-lg bg-gray-600/80 px-2 py-1.5 text-xs font-medium text-gray-300 transition-all duration-200 hover:bg-gray-600 hover:text-white"
                              >
                                &#x1F310; Translate
                              </a>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
                            <p className="mt-1 min-w-0 max-w-full text-sm text-gray-400">
                              {example.en}
                            </p>
                            <button
                              type="button"
                              onClick={() => copyExampleToClipboard(example.en, idx, 'en')}
                              title="Copy English translation"
                              className={`flex-shrink-0 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                                enCopied
                                  ? 'bg-green-600/30 text-green-300'
                                  : 'bg-gray-600/80 text-gray-300 hover:bg-gray-600 hover:text-white'
                              }`}
                            >
                              {enCopied ? '\u2713 Copied!' : '\u2398 Copy'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={toggleAnswer}
          className="group relative inline-flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-xl bg-gray-700 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span className="absolute inset-0 bg-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            {showAnswer ? 'Hide answer' : 'Show answer'}
          </span>
        </button>

        <button
          type="button"
          onClick={goPrevious}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-700 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span className="absolute inset-0 bg-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            Previous
          </span>
        </button>

        <button
          type="button"
          onClick={handleKnown}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-gray-900/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/40"
        >
          <span className="absolute inset-0 bg-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            Next
          </span>
        </button>
      </div>

      {stats && (
        <div className="mt-2 text-center text-xs text-gray-400">
          Viewed so far:{' '}
          <span className="font-semibold text-gray-200">{viewedCount}</span>{' '}
          cards · Known: <span className="font-semibold text-gray-200">{stats.flashcardsKnown}</span>
        </div>
      )}
    </div>
  )
}

export default FlashcardGame
