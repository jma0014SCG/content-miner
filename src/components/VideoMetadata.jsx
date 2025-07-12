import { ExternalLink, Clock, Users as UsersIcon, Calendar, Eye } from 'lucide-react'

function VideoMetadata({ result, url }) {
  // Extract video ID from YouTube URL for thumbnail
  const getVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }
  
  const videoId = getVideoId(url)
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null

  return (
    <div className="rounded-2xl shadow-sm bg-white/90 backdrop-blur border border-gray-100 p-6 mb-8">
      <div className="flex gap-6">
        {/* Video Thumbnail */}
        {thumbnailUrl && (
          <div className="flex-shrink-0">
            <img 
              src={thumbnailUrl} 
              alt="Video thumbnail"
              className="w-40 h-24 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}
        
        {/* Video Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">
              {result.metadata?.title || 'YouTube Video Summary'}
            </h1>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors shrink-0 ml-4"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open on YouTube
            </a>
          </div>
          
          {/* Channel and metadata */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
            {result.metadata?.channel && (
              <span className="font-medium text-gray-900">{result.metadata.channel}</span>
            )}
            {result.metadata?.duration && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {result.metadata.duration}
              </div>
            )}
            {result.metadata?.views && (
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {result.metadata.views}
              </div>
            )}
            {result.metadata?.publish_date && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {result.metadata.publish_date}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoMetadata