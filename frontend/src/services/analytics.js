import posthog from 'posthog-js'

const initializePostHog = () => {
  if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_API_KEY) {
    posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (import.meta.env.VITE_ENVIRONMENT === 'development') {
          posthog.debug()
        }
      }
    })
  }
}

// Analytics event functions based on PRD success metrics
export const trackVideoSummarizeStarted = (url) => {
  posthog.capture('video_summarize_started', {
    url,
    timestamp: Date.now()
  })
}

export const trackVideoSummarizeCompleted = (url, duration) => {
  posthog.capture('video_summarize_completed', {
    url,
    duration,
    timestamp: Date.now()
  })
}

export const trackChannelAnalyzeStarted = (url) => {
  posthog.capture('channel_analyze_started', {
    url,
    timestamp: Date.now()
  })
}

export const trackChannelAnalyzeCompleted = (url, duration) => {
  posthog.capture('channel_analyze_completed', {
    url,
    duration,
    timestamp: Date.now()
  })
}

export const trackSummaryCopied = (type, url) => {
  posthog.capture('summary_copied', {
    type, // 'video' or 'channel'
    url,
    timestamp: Date.now()
  })
}

export const trackSummaryDownloaded = (type, url) => {
  posthog.capture('summary_downloaded', {
    type, // 'video' or 'channel'
    url,
    timestamp: Date.now()
  })
}

export const trackUserActivated = (userId = null) => {
  posthog.capture('user_activated', {
    userId,
    timestamp: Date.now()
  })
  
  // Set user property for activated users
  posthog.people.set({
    activated: true,
    first_activation: new Date().toISOString()
  })
}

export const trackError = (error, context) => {
  posthog.capture('error_occurred', {
    error: error.message,
    context,
    timestamp: Date.now()
  })
}

// Initialize PostHog
initializePostHog()

export default posthog