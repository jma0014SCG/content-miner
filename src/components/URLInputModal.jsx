import { useState } from 'react'
import { X } from 'lucide-react'

function URLInputModal({ type, onClose, onSubmit }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const validateURL = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//
    return youtubeRegex.test(url)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!validateURL(url)) {
      setError('Please enter a valid YouTube URL')
      return
    }

    onSubmit(url.trim())
  }

  const placeholderText = type === 'video' 
    ? 'https://youtube.com/watch?v=...'
    : 'https://youtube.com/@channel or https://youtube.com/channel/...'

  const title = type === 'video' ? 'Summarize Video' : 'Analyze Channel'
  const description = type === 'video' 
    ? 'Enter a YouTube video URL to get an AI-generated summary'
    : 'Enter a YouTube channel URL to get competitive intelligence'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 mb-4">{description}</p>
          
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholderText}
              className="input-field"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {type === 'video' ? 'Summarize' : 'Analyze'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default URLInputModal