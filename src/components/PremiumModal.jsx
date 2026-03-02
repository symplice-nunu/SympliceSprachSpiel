import { useEffect, useState } from 'react'

/**
 * Reusable 3-step premium upgrade modal.
 * Props:
 *   lockedCount  – number shown in the pitch ("X more … available with Premium")
 *   contentLabel – e.g. "videos" | "quizzes"
 *   benefits     – string[] shown as bullet points
 *   onClose      – called when the modal should be dismissed
 */
function PremiumModal({ lockedCount, contentLabel = 'lessons', benefits, onClose }) {
  const [step, setStep] = useState('upgrade') // 'upgrade' | 'payment' | 'success'
  const [copied, setCopied] = useState(null)

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

  function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gray-900 p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-700 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── Step 1: upgrade pitch ── */}
        {step === 'upgrade' && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 ring-2 ring-yellow-500/40">
              <svg className="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white">
              Unlock All Premium {contentLabel.charAt(0).toUpperCase() + contentLabel.slice(1)}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              You&apos;re using the free version.{' '}
              <span className="font-medium text-yellow-400">
                {lockedCount} more {contentLabel}
              </span>{' '}
              are available with Premium.
            </p>

            <ul className="mt-6 space-y-2 text-left text-sm text-gray-300">
              {(benefits ?? defaultBenefits(contentLabel)).map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <svg className="h-4 w-4 flex-shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setStep('payment')}
              className="mt-8 w-full rounded-xl bg-yellow-500 py-3 text-sm font-bold text-gray-900 transition-all duration-200 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20"
            >
              Upgrade to Premium
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full rounded-xl py-2.5 text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              Maybe later
            </button>
          </>
        )}

        {/* ── Step 2: payment details ── */}
        {step === 'payment' && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 ring-2 ring-yellow-500/40">
              <svg className="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white">Complete Your Payment</h2>
            <p className="mt-2 text-sm text-gray-400">
              Send your payment using one of the methods below, then click{' '}
              <span className="font-medium text-yellow-400">I&apos;ve Paid</span> to confirm.
            </p>

            <div className="mt-6 space-y-3 text-left">
              {/* MoMo */}
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
                    Mobile Money
                  </span>
                </div>
                <p className="text-xs text-gray-400">MoMo number</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-lg font-bold tracking-widest text-white">0785847049</span>
                  <CopyButton value="0785847049" label="momo" copied={copied} onCopy={copyToClipboard} />
                </div>
              </div>

              {/* Bank */}
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                    Bank Transfer
                  </span>
                </div>
                <p className="text-xs text-gray-400">Account number</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-lg font-bold tracking-widest text-white">476847663675736</span>
                  <CopyButton value="476847663675736" label="bank" copied={copied} onCopy={copyToClipboard} />
                </div>
              </div>
            </div>

            {/* WhatsApp instruction */}
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-left">
              <WhatsAppIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
              <p className="text-xs text-gray-300">
                After paying, <span className="font-semibold text-white">take a screenshot</span> of
                your payment confirmation and send it to our WhatsApp{' '}
                <a
                  href="https://wa.me/250785847049"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-green-400 underline underline-offset-2"
                >
                  +250 785 847 049
                </a>{' '}
                to get your courses unblocked.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('success')}
              className="mt-4 w-full rounded-xl bg-yellow-500 py-3 text-sm font-bold text-gray-900 transition-all duration-200 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20"
            >
              I&apos;ve Paid &#10003;
            </button>
            <button
              type="button"
              onClick={() => setStep('upgrade')}
              className="mt-3 w-full rounded-xl py-2.5 text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              &#8592; Back
            </button>
          </>
        )}

        {/* ── Step 3: success ── */}
        {step === 'success' && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500/40">
              <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white">One last step!</h2>
            <p className="mt-2 text-sm text-gray-400">
              Take a <span className="font-semibold text-white">screenshot</span> of your payment
              confirmation and send it to our WhatsApp to get your courses unblocked.
            </p>

            <a
              href="https://wa.me/250785847049"
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/20"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Send screenshot on WhatsApp
            </a>

            <p className="mt-2 text-xs text-gray-500">
              WhatsApp: <span className="text-gray-400">+250 785 847 049</span>
            </p>

            <div className="mt-4 rounded-xl border border-gray-700 bg-gray-800/50 p-4 text-xs text-gray-400">
              Once we confirm your payment, your Premium courses will be unlocked within{' '}
              <span className="font-medium text-white">24 hours</span>.
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full rounded-xl py-2.5 text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              Continue learning for now
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function CopyButton({ value, label, copied, onCopy }) {
  const isCopied = copied === label
  return (
    <button
      type="button"
      onClick={() => onCopy(value, label)}
      className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
    >
      {isCopied ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.526 5.845L0 24l6.336-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.371l-.36-.214-3.728.888.918-3.636-.235-.374A9.818 9.818 0 1112 21.818z" />
    </svg>
  )
}

function defaultBenefits(contentLabel) {
  if (contentLabel === 'videos') {
    return [
      'Access all video lessons across A1, A2 & B1',
      'New videos added every week',
      'Watch at your own pace, anytime',
      'Complement your flashcard & quiz practice',
    ]
  }
  return [
    'Access all 12 premium quizzes across A1, A2 & B1',
    'Advanced grammar, idioms & professional German',
    'Detailed answer explanations for every question',
    'Track your score and accuracy over time',
  ]
}

export default PremiumModal
