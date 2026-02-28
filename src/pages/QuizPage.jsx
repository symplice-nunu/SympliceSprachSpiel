import { useOutletContext } from 'react-router-dom'
import QuizGame from '../components/QuizGame.jsx'

function QuizPage() {
  const { level, currentStats, handleQuizAnswer } = useOutletContext()

  return (
    <QuizGame
      level={level}
      stats={currentStats}
      onAnswer={handleQuizAnswer}
    />
  )
}

export default QuizPage
