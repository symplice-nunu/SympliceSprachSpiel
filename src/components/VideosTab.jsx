import { memo, useEffect, useState } from 'react'
import { YOUTUBE_VIDEOS } from '../data/videos.js'
import { FREE_VIDEOS_COUNT } from '../constants.js'
import PremiumModal from './PremiumModal.jsx'

// ─── Free video card ──────────────────────────────────────────────────────────

const VideoCard = memo(function VideoCard({ video, index, onSelect }) {
  const isFree = index < FREE_VIDEOS_COUNT

  return (
    <button
      type="button"
      onClick={() => onSelect(video, isFree)}
      className="group flex flex-col overflow-hidden rounded-xl bg-gray-800/50 text-left transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-900">
        <img
          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
          alt={video.title}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isFree ? '' : 'opacity-40'
          }`}
        />

        {isFree ? (
          /* Play button – free */
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full bg-black/50 p-4 backdrop-blur-sm">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        ) : (
          /* Lock overlay – premium */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
            <div className="rounded-full bg-yellow-500/20 p-3 backdrop-blur-sm ring-1 ring-yellow-500/40">
              <svg className="h-7 w-7 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-yellow-400">Premium</span>
          </div>
        )}

        {/* Badge: Free Preview / Premium */}
        <div
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
            isFree
              ? 'bg-green-500/90 text-white'
              : 'bg-yellow-500/90 text-gray-900'
          }`}
        >
          {isFree ? 'Free Preview' : 'Premium'}
        </div>

        {/* Duration – free only */}
        {isFree && (
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
            {video.duration}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span
          className={`line-clamp-2 text-sm font-semibold leading-snug ${
            isFree ? 'text-white' : 'text-gray-400'
          }`}
        >
          {video.title}
        </span>
        <span className="text-xs text-gray-500">{video.channel}</span>
        <span className="mt-1 line-clamp-2 text-xs text-gray-600">{video.description}</span>
        <div className="mt-auto pt-2">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs ${
              isFree
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-800 text-gray-500'
            }`}
          >
            {video.topic}
          </span>
        </div>
      </div>
    </button>
  )
})

// ─── Video player modal ───────────────────────────────────────────────────────

function VideoPlayer({ video, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white">{video.title}</h3>
              <p className="mt-0.5 text-sm text-gray-400">{video.channel}</p>
              <p className="mt-2 text-sm text-gray-300">{video.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main tab ─────────────────────────────────────────────────────────────────

function VideosTab({ level }) {
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showPremium, setShowPremium] = useState(false)

  const videos = YOUTUBE_VIDEOS[level]
  const topics = ['All', ...new Set(videos.map((v) => v.topic))]
  const filtered = selectedTopic === 'All' ? videos : videos.filter((v) => v.topic === selectedTopic)

  // Count locked videos across the full list (not filtered) for the modal copy
  const totalLocked = videos.length - FREE_VIDEOS_COUNT

  function handleSelect(video, isFree) {
    if (isFree) {
      setSelectedVideo(video)
    } else {
      setShowPremium(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gray-800/30 p-6 backdrop-blur-sm">
        <div className="mb-1 flex items-center gap-3">
          <svg className="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <h2 className="text-xl font-semibold text-white">Video Lessons</h2>
        </div>
        <p className="text-sm text-gray-400">
          {FREE_VIDEOS_COUNT} free previews available for {level} learners.{' '}
          <button
            type="button"
            onClick={() => setShowPremium(true)}
            className="font-medium text-yellow-400 underline-offset-2 hover:underline"
          >
            Upgrade to unlock all {videos.length} videos.
          </button>
        </p>
      </div>

      {/* Topic filter */}
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => setSelectedTopic(topic)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              selectedTopic === topic
                ? 'bg-gray-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((video) => {
          // Determine the true index in the full list for the free/locked threshold
          const globalIndex = videos.indexOf(video)
          return (
            <VideoCard
              key={video.id}
              video={video}
              index={globalIndex}
              onSelect={handleSelect}
            />
          )
        })}
      </div>

      {/* Premium upsell banner */}
      {totalLocked > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-6 py-4">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">{totalLocked} more videos</span> locked behind Premium
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPremium(true)}
            className="flex-shrink-0 rounded-lg bg-yellow-500 px-4 py-1.5 text-xs font-bold text-gray-900 transition-all duration-200 hover:bg-yellow-400"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
      {showPremium && (
        <PremiumModal
          lockedCount={totalLocked}
          contentLabel="videos"
          onClose={() => setShowPremium(false)}
        />
      )}
    </div>
  )
}

export { VideosTab as default }
