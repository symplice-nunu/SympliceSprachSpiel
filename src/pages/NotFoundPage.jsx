import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-700">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
        <p className="mt-2 text-gray-400">The page you are looking for does not exist.</p>
        <Link
          to="/videos"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gray-700 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-600"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
