import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Users, ArrowRight, Star, TrendingUp, Clock, Download } from 'lucide-react'
import URLInputModal from '../components/URLInputModal'

function LandingPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const navigate = useNavigate()

  const handleGetStarted = (type) => {
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

  useEffect(() => {
    // Initialize Vanta.js waves background
    if (window.VANTA && window.VANTA.WAVES) {
      window.VANTA.WAVES({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x059669, // emerald color
        shininess: 35.00,
        waveHeight: 15.00,
        waveSpeed: 0.75,
        zoom: 0.65
      })
    }
  }, [])

  return (
    <div className="bg-[#0A0C10] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div id="vanta-bg" className="absolute inset-0 z-0 opacity-60"></div>
        
        <nav className="relative z-10 px-6 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold">ContentMiner</span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#support" className="text-gray-300 hover:text-white transition-colors">Support</a>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleGetStarted('video')}
                className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Try Free
              </button>
            </div>
          </div>
        </nav>
        
        <main className="relative z-10 px-6 pt-16 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold bg-emerald-600/20 text-emerald-400 rounded-full">
                  Fast. Accurate. Export-ready.
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
                  Turn YouTube into
                  <span className="text-emerald-500"> Instant Insights</span>
                </h1>
                <p className="text-lg text-gray-400 mb-8 max-w-lg">
                  Get AI-powered summaries of any YouTube video or channel in seconds. 
                  Perfect for learners, creators, and professionals who need information fast.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button 
                    onClick={() => handleGetStarted('video')}
                    className="px-6 py-3 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Summarize Video
                  </button>
                  <button 
                    onClick={() => handleGetStarted('channel')}
                    className="px-6 py-3 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Analyze Channel
                  </button>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">Trusted by creators</span>
                  </div>
                  <div className="h-10 border-l border-gray-700"></div>
                  <div className="text-sm text-gray-400">
                    <span className="block font-medium text-white">10,000+ videos</span>
                    analyzed this month
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500 opacity-10 blur-3xl rounded-full"></div>
                <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                          <Play className="w-3 h-3 text-white" />
                        </div>
                        <span className="ml-3 font-medium">Content Analysis</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium">Key Insights</div>
                            <div className="text-xs text-gray-400">Main takeaways extracted</div>
                          </div>
                        </div>
                        <div className="text-xs text-emerald-400">✓ Ready</div>
                      </div>
                      <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium">Timeline Summary</div>
                            <div className="text-xs text-gray-400">Timestamped highlights</div>
                          </div>
                        </div>
                        <div className="text-xs text-blue-400">✓ Ready</div>
                      </div>
                      <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <Download className="w-4 h-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium">Export Options</div>
                            <div className="text-xs text-gray-400">Markdown, PDF, Text</div>
                          </div>
                        </div>
                        <div className="text-xs text-purple-400">✓ Ready</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to extract insights
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful AI tools to transform any YouTube content into actionable knowledge
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-emerald-500/50 transition-colors cursor-pointer group"
              onClick={() => handleGetStarted('video')}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <Play className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold">Video Summarization</h3>
                <ArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="text-gray-400 mb-4">
                Paste any YouTube video URL and get comprehensive markdown summaries 
                with key insights, main points, and actionable takeaways.
              </p>
              <div className="text-sm text-gray-500">
                Perfect for: Lectures, tutorials, interviews, presentations
              </div>
            </div>

            <div 
              className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-emerald-500/50 transition-colors cursor-pointer group"
              onClick={() => handleGetStarted('channel')}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold">Channel Analysis</h3>
                <ArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="text-gray-400 mb-4">
                Enter a YouTube channel URL to discover content themes, 
                video patterns, and competitive intelligence for creators.
              </p>
              <div className="text-sm text-gray-500">
                Perfect for: Content strategy, competitor research, market analysis
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default LandingPage