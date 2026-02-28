import { memo } from 'react'
import { LEVELS } from '../constants.js'
import { calculatePercentage } from '../utils/helpers.js'

const ProgressBadges = memo(function ProgressBadges({ stats }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {LEVELS.map((level) => {
        const s = stats[level]
        const flashRate = calculatePercentage(s.flashcardsKnown, s.flashcardsSeen)
        const quizRate = calculatePercentage(s.quizCorrect, s.quizPlayed)

        return (
          <div
            key={level}
            className="group relative overflow-hidden rounded-2xl bg-gray-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/50"
          >
            <div className="absolute inset-0 bg-gray-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Level
                  </p>
                  <p className="text-2xl font-bold text-white">{level}</p>
                </div>
                <div className="text-right text-xs space-y-1">
                  <p className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    <span className="text-gray-300">Flash:</span>
                    <span className="font-semibold text-gray-300">
                      {flashRate}%
                    </span>
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    <span className="text-gray-300">Quiz:</span>
                    <span className="font-semibold text-gray-300">
                      {quizRate}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})

export default ProgressBadges
