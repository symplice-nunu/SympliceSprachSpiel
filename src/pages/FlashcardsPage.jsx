import { useOutletContext } from 'react-router-dom'
import FlashcardGame from '../components/FlashcardGame.jsx'

function FlashcardsPage() {
  const { level, currentStats, handleSeenWord, handleKnownWord, handleFlashcardIndexChange } =
    useOutletContext()

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

export default FlashcardsPage
