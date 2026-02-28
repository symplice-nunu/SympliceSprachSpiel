import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const VideosPage = lazy(() => import('./pages/VideosPage.jsx'))
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage.jsx'))
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/videos" replace /> },
      { path: 'videos', element: <VideosPage /> },
      { path: 'flashcards', element: <FlashcardsPage /> },
      { path: 'quiz', element: <QuizPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
