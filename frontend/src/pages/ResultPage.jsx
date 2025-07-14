import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Copy, CheckCircle } from 'lucide-react'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ResultDisplay from '../components/ResultDisplay'
import { summarizeVideo, analyzeChannel } from '../services/api'
import { 
  trackVideoSummarizeStarted, 
  trackVideoSummarizeCompleted,
  trackChannelAnalyzeStarted,
  trackChannelAnalyzeCompleted,
  trackSummaryCopied,
  trackSummaryDownloaded,
  trackUserActivated,
  trackError
} from '../services/analytics'

function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const hasInitiatedRequest = useRef(false)

  const { url, type } = location.state || {}

  useEffect(() => {
    if (!url || !type) {
      navigate('/')
      return
    }

    // Prevent duplicate calls in React.StrictMode (temporarily disabled for debugging)
    // if (hasInitiatedRequest.current) {
    //   return
    // }
    // hasInitiatedRequest.current = true

    const fetchResult = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const startTime = Date.now()
        
        // Track start events
        if (type === 'video') {
          trackVideoSummarizeStarted(url)
        } else {
          trackChannelAnalyzeStarted(url)
        }
        
        let response
        if (type === 'video') {
          response = await summarizeVideo(url)
        } else {
          response = await analyzeChannel(url)
        }
        
        const duration = Date.now() - startTime
        
        // Track completion events
        if (type === 'video') {
          trackVideoSummarizeCompleted(url, duration)
        } else {
          trackChannelAnalyzeCompleted(url, duration)
        }
        
        // Track user activation (first successful summary)
        trackUserActivated()
        
        setResult(response)
      } catch (err) {
        const errorMessage = err.message || 'An error occurred while processing your request'
        setError(errorMessage)
        trackError(err, { type, url })
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [url, type, navigate])

  const handleCopy = async () => {
    try {
      const textToCopy = type === 'video' ? result.summary : JSON.stringify(result.analysis, null, 2)
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      // Track copy event
      trackSummaryCopied(type, url)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      trackError(err, { action: 'copy', type, url })
    }
  }

  const handleDownload = () => {
    const content = type === 'video' ? result.summary : JSON.stringify(result.analysis, null, 2)
    const blob = new Blob([content], { type: 'text/markdown' })
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `insight-${type}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
    
    // Track download event
    trackSummaryDownloaded(type, url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <LoadingSkeleton type={type} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <div className="card max-w-2xl mx-auto text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              className="btn-secondary flex items-center"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        <ResultDisplay result={result} type={type} url={url} />
      </div>
    </div>
  )
}

export default ResultPage