import { memo } from 'react'
import { LEVELS } from '../constants.js'

const LevelSelector = memo(function LevelSelector({ currentLevel, onSelect }) {
  return (
    <div className="inline-flex gap-2 rounded-2xl bg-gray-800/50 p-1.5 backdrop-blur-sm">
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onSelect(level)}
          className={`relative px-5 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
            currentLevel === level
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {currentLevel === level && (
            <span className="absolute inset-0 rounded-xl bg-gray-600 shadow-lg shadow-gray-900/25 animate-pulse-slow" />
          )}
          <span className="relative">{level}</span>
        </button>
      ))}
    </div>
  )
})

export default LevelSelector
