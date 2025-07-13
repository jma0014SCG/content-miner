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
  const [activeTab, setActiveTab] = useState(type === 'video' ? 'highlights' : 'insights')
  
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
    const tldrSection = sections.find(section => section.title.toLowerCase().includes('tl;dr'))
    const otherSections = sections.filter(section => !section.title.toLowerCase().includes('tl;dr'))
    
    return (
      <div className="content-wrapper">
        {/* Left Rail - Quick Navigation */}
        <div className="left-rail">
          <AnchorRail sections={sections} />
        </div>
        
        {/* Main Content */}
        <div className="main-content">
          <VideoMetadata result={result} url={url} />
          
          <NavigationTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            tabs={['highlights', 'timeline', 'export']}
          />
          
          <div style={{ marginBottom: 'var(--space-4)' }}>
            {activeTab === 'highlights' && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                {/* Hero TL;DR Section */}
                {tldrSection && (
                  <div className="card" style={{ 
                    background: 'linear-gradient(to right, #f0fdf4, #eff6ff)',
                    border: '2px solid #10b981',
                    marginBottom: 'var(--space-6)'
                  }}>
                    <div className="section-head">
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: '#10b981', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h2 className="h1" style={{ margin: 0, color: 'var(--gray-900)' }}>
                        {tldrSection.title}
                      </h2>
                    </div>
                    <div className="prose-enhanced body" style={{ lineHeight: '1.6' }}>
                      <ReactMarkdown>{tldrSection.content.join('\n')}</ReactMarkdown>
                    </div>
                  </div>
                )}
                
                {/* Other Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {otherSections.map((section, index) => (
                    <ContentCard
                      key={section.id}
                      id={section.id}
                      title={section.title}
                      content={section.content.join('\n')}
                      defaultOpen={index < 2}
                      designSystem={true}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'timeline' && (
              <div>
                <ContentCard
                  id="full-content"
                  title="Full Summary"
                  content={result.summary}
                  defaultOpen={true}
                  designSystem={true}
                />
              </div>
            )}
            
            {activeTab === 'export' && (
              <div>
                <ContentCard
                  id="export-options"
                  title="Export Options"
                  content="Choose your preferred format to export the summary."
                  defaultOpen={true}
                  designSystem={true}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Right Rail - Actions */}
        <div className="right-rail">
          <UtilityBar result={result} type={type} />
        </div>
      </div>
    )
  }

  // Channel analysis version
  if (!result) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No Result Data</h2>
        <p>The channel analysis result is null or undefined.</p>
      </div>
    );
  }

  // Get analysis content with multiple fallbacks
  let analysisContent = '';
  if (result.analysis) {
    if (typeof result.analysis === 'string') {
      analysisContent = result.analysis;
    } else {
      analysisContent = JSON.stringify(result.analysis, null, 2);
    }
  } else if (result.summary) {
    analysisContent = result.summary;
  } else {
    analysisContent = 'Channel analysis completed but no content found. Check backend response structure.';
  }
  
  // Create sections - using the same logic as video but simpler
  const channelSections = [];
  
  // Try to parse with markdown headers first
  if (analysisContent.includes('##')) {
    const sections = parseSummary(analysisContent);
    if (sections.length > 0) {
      channelSections.push(...sections);
    }
  }
  
  // If no sections from parsing, create a default one
  if (channelSections.length === 0) {
    channelSections.push({
      id: 'channel-insights',
      title: 'Channel Insights',
      content: [analysisContent]
    });
  }
  
  // Add content opportunities if they exist
  if (result.content_gaps && Array.isArray(result.content_gaps) && result.content_gaps.length > 0) {
    channelSections.push({
      id: 'content-opportunities',
      title: 'Content Opportunities',
      content: result.content_gaps.map((gap, index) => `${index + 1}. ${gap}`)
    });
  }
  
  const keyInsightsSection = channelSections[0];
  const otherSections = channelSections.slice(1);

  return (
    <div className="content-wrapper">
      {/* Left Rail - Quick Navigation */}
      <div className="left-rail">
        <AnchorRail sections={channelSections} />
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Channel Metadata - simplified version */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
            Channel Analysis
          </h1>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginTop: '16px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#18a7ff',
                background: 'rgba(24, 167, 255, 0.05)',
                border: '1px solid rgba(24, 167, 255, 0.2)',
                borderRadius: '8px',
                textDecoration: 'none'
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Channel
            </a>
          )}
        </div>
        
        <NavigationTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          tabs={['insights', 'strategy', 'export']}
        />
        
        <div style={{ marginBottom: 'var(--space-4)' }}>
          {activeTab === 'insights' && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              {/* Hero Key Insights Section */}
              {keyInsightsSection && (
                <div className="card" style={{ 
                  background: 'linear-gradient(to right, #f0fdf4, #eff6ff)',
                  border: '2px solid #10b981',
                  marginBottom: 'var(--space-6)'
                }}>
                  <div className="section-head">
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: '#10b981', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="h1" style={{ margin: 0, color: 'var(--gray-900)' }}>
                      {keyInsightsSection.title}
                    </h2>
                  </div>
                  <div className="prose-enhanced body" style={{ lineHeight: '1.6' }}>
                    <ReactMarkdown>{keyInsightsSection.content.join('\n')}</ReactMarkdown>
                  </div>
                </div>
              )}
              
              {/* Other Sections */}
              {otherSections.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {otherSections.map((section, index) => (
                    <ContentCard
                      key={section.id}
                      id={section.id}
                      title={section.title}
                      content={section.content.join('\n')}
                      defaultOpen={index < 2}
                      designSystem={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'strategy' && (
            <div>
              <ContentCard
                id="full-analysis"
                title="Full Channel Analysis"
                content={result.analysis ? (typeof result.analysis === 'string' ? result.analysis : JSON.stringify(result.analysis, null, 2)) : 'No analysis data available'}
                defaultOpen={true}
                designSystem={true}
              />
            </div>
          )}
          
          {activeTab === 'export' && (
            <div>
              <ContentCard
                id="export-options"
                title="Export Options"
                content="Choose your preferred format to export the channel analysis."
                defaultOpen={true}
                designSystem={true}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Right Rail - Actions */}
      <div className="right-rail">
        <UtilityBar result={result} type={type} />
      </div>
    </div>
  )
}

export default ResultDisplay