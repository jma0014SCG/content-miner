import { Loader2 } from 'lucide-react'

function LoadingSkeleton({ type }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mr-3" />
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              {type === 'video' ? 'Summarizing Video...' : 'Analyzing Channel...'}
            </h2>
            <p className="text-gray-600">
              {type === 'video' 
                ? 'This usually takes 15-30 seconds'
                : 'This may take up to 2 minutes'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          <div className="mt-8 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSkeleton