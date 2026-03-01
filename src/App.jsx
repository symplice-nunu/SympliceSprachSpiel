import AppLayout from './layouts/AppLayout.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const KNOWN_PATHS = ['/', '/videos', '/flashcards', '/quiz']

function App() {
  if (!KNOWN_PATHS.includes(window.location.pathname)) {
    return <NotFoundPage />
  }
  return <AppLayout />
}

export default App
