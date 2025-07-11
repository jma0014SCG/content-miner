import ReactMarkdown from 'react-markdown'
import { ExternalLink, Clock, Users as UsersIcon, TrendingUp } from 'lucide-react'

function ResultDisplay({ result, type, url }) {
  if (type === 'video') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Video Summary</h1>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View Original
            </a>
          </div>
          
          {result.metadata && (
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              {result.metadata.duration && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {result.metadata.duration}
                </div>
              )}
              {result.metadata.views && (
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-1" />
                  {result.metadata.views} views
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{result.summary}</ReactMarkdown>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Channel Analysis</h1>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View Channel
          </a>
        </div>
        
        {result.metadata && (
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            {result.metadata.subscriber_count && (
              <div className="flex items-center">
                <UsersIcon className="w-4 h-4 mr-1" />
                {result.metadata.subscriber_count} subscribers
              </div>
            )}
            {result.metadata.video_count && (
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {result.metadata.video_count} videos
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {result.analysis && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Channel Insights</h2>
            <div className="prose max-w-none">
              {typeof result.analysis === 'string' ? (
                <ReactMarkdown>{result.analysis}</ReactMarkdown>
              ) : (
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(result.analysis, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}

        {result.content_gaps && result.content_gaps.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Content Opportunities</h2>
            <ul className="space-y-2">
              {result.content_gaps.map((gap, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultDisplay