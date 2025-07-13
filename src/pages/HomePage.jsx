import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Users } from 'lucide-react'
import URLInputModal from '../components/URLInputModal'

function HomePage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const navigate = useNavigate()

  const handleCardClick = (type) => {
    setSelectedType(type)
    setShowModal(true)
  }

  const handleSubmit = (url) => {
    navigate('/result', { 
      state: { 
        url, 
        type: selectedType 
      } 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Turn YouTube into
            <span className="text-primary-600"> Instant Insights</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get AI-powered summaries of any YouTube video or channel in seconds. 
            Perfect for learners and creators who need information fast.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div 
            className="card hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => handleCardClick('video')}
          >
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <Play className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Summarize Video
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Paste any YouTube video URL and get a comprehensive markdown summary 
              with key insights, main points, and actionable takeaways.
            </p>
            <div className="text-sm text-gray-500">
              Perfect for: Lectures, tutorials, interviews, presentations
            </div>
          </div>

          <div 
            className="card hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => handleCardClick('channel')}
          >
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Analyze Channel
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Enter a YouTube channel URL to discover content themes, 
              video patterns, and competitive intelligence for creators.
            </p>
            <div className="text-sm text-gray-500">
              Perfect for: Content strategy, competitor research, market analysis
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500">
            Fast • Accurate • Export-ready
          </p>
        </div>
      </div>

      {showModal && (
        <URLInputModal
          type={selectedType}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

export default HomePage