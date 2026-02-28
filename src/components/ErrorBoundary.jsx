import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-gray-800/50 py-24 text-center">
          <p className="text-5xl font-bold text-gray-600">!</p>
          <h2 className="mt-4 text-lg font-semibold text-white">Something went wrong</h2>
          <p className="mt-1 text-sm text-gray-400">
            This page failed to load. Check your connection and try again.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-6 rounded-xl bg-gray-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-600"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
