import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { 
  ExternalLink, 
  Clock, 
  Users as UsersIcon, 
  TrendingUp, 
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Share
} from 'lucide-react'
import VideoMetadata from './VideoMetadata'
import NavigationTabs from './NavigationTabs'
import AnchorRail from './AnchorRail'
import ContentCard from './ContentCard'
import UtilityBar from './UtilityBar'

function ResultDisplay({ result, type, url }) {
  const [activeTab, setActiveTab] = useState('highlights')
  
  // Parse the summary to extract sections
  const parseSummary = (summary) => {
    if (!summary) return []
    
    // Remove markdown wrapper tags
    const cleanSummary = summary
      .replace(/---MARKDOWN START---/g, '')
      .replace(/---MARKDOWN END---/g, '')
      .replace(/---JSON START---[\s\S]*?---JSON END---/g, '')
      .replace(/---SOCIAL START---[\s\S]*?---SOCIAL END---/g, '')
      .trim()
    
    const sections = []
    const lines = cleanSummary.split('\n')
    let currentSection = null
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection)
        }
        currentSection = {
          id: trimmedLine.substring(3).toLowerCase().replace(/[^a-z0-9]/g, '-'),
          title: trimmedLine.substring(3),
          content: []
        }
      } else if (currentSection && trimmedLine) {
        currentSection.content.push(line)
      }
    })
    
    if (currentSection) {
      sections.push(currentSection)
    }
    
    return sections
  }
  
  if (type === 'video') {
    const sections = parseSummary(result.summary)
    
    return (
      <div className="grid lg:grid-cols-[220px_1fr_140px] gap-8 max-w-7xl mx-auto">
        {/* Left Anchor Rail */}
        <AnchorRail sections={sections} />
        
        {/* Main Content */}
        <div className="min-w-0">
          <VideoMetadata result={result} url={url} />
          
          <NavigationTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            tabs={['highlights', 'timeline', 'export']}
          />
          
          <div className="space-y-6">
            {activeTab === 'highlights' && (
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <ContentCard
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    content={section.content.join('\n')}
                    defaultOpen={index === 0} // TL;DR open by default
                  />
                ))}
              </div>
            )}
            
            {activeTab === 'timeline' && (
              <ContentCard
                id="full-content"
                title="Full Summary"
                content={result.summary}
                defaultOpen={true}
              />
            )}
            
            {activeTab === 'export' && (
              <div className="space-y-6">
                <ContentCard
                  id="export-options"
                  title="Export Options"
                  content="Choose your preferred format to export the summary."
                  defaultOpen={true}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Right Utility Bar */}
        <UtilityBar result={result} type={type} />
      </div>
    )
  }

  // Channel analysis version with new layout
  return (
    <div className="grid lg:grid-cols-[220px_1fr_140px] gap-8 max-w-7xl mx-auto">
      {/* Left Anchor Rail - simplified for channel */}
      <nav className="hidden lg:block sticky top-24 space-y-3 h-fit">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Navigation</h3>
        <button
          onClick={() => document.getElementById('channel-insights')?.scrollIntoView({ behavior: 'smooth' })}
          className="block w-full text-left text-sm text-gray-600 hover:text-emerald-600 transition-colors py-1"
        >
          Channel Insights
        </button>
        {result.content_gaps && result.content_gaps.length > 0 && (
          <button
            onClick={() => document.getElementById('content-opportunities')?.scrollIntoView({ behavior: 'smooth' })}
            className="block w-full text-left text-sm text-gray-600 hover:text-emerald-600 transition-colors py-1"
          >
            Content Opportunities
          </button>
        )}
      </nav>
      
      {/* Main Content */}
      <div className="min-w-0">
        {/* Channel Metadata Header */}
        <div className="rounded-2xl shadow-sm bg-white/90 backdrop-blur border border-gray-100 p-6 mb-8">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">
              Channel Analysis
            </h1>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors shrink-0 ml-4"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Channel
            </a>
          </div>
          
          {result.metadata && (
            <div className="flex items-center space-x-6 text-sm text-gray-600">
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

        {/* Content Cards */}
        <div className="space-y-6">
          {result.analysis && (
            <ContentCard
              id="channel-insights"
              title="Channel Insights"
              content={typeof result.analysis === 'string' ? result.analysis : JSON.stringify(result.analysis, null, 2)}
              defaultOpen={true}
            />
          )}

          {result.content_gaps && result.content_gaps.length > 0 && (
            <div 
              id="content-opportunities"
              className="rounded-2xl shadow-sm bg-white/90 backdrop-blur border border-gray-100 hover:shadow-md transition-shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Opportunities</h3>
              <ul className="space-y-3">
                {result.content_gaps.map((gap, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5 shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Utility Bar */}
      <UtilityBar result={result} type={type} />
    </div>
  )
}

export default ResultDisplay