import { useCallback, useEffect, useState } from 'react'
import { loadProgress, saveProgress } from '../utils/storage.js'

export function useGameProgress() {
  const [progress, setProgress] = useState(() => loadProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const updateLevel = useCallback((level, updater) => {
    setProgress((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [level]: updater(prev.stats[level]),
      },
    }))
  }, [])

  return { progress, updateLevel }
}
