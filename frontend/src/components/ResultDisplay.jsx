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
import ChannelKPIs from './ChannelKPIs'

function ResultDisplay({ result, type, url }) {
  const [activeTab, setActiveTab] = useState(type === 'video' ? 'highlights' : 'insights')
  const [allSectionsOpen, setAllSectionsOpen] = useState(true)
  
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

  // Parse channel analysis into the exact 8 sections specified
  const parseChannelAnalysis = (analysis) => {
    try {
      if (!analysis) return []
      
      // Convert analysis to string if needed
      const analysisText = typeof analysis === 'string' ? analysis : JSON.stringify(analysis, null, 2)
      
      // Define the exact 8 sections that should always be shown
      const sections = [
        { 
          id: 'executive-tldr',
          title: 'Executive TL;DR (≤120 words)',
          sectionType: 'insights',
          icon: '⚡',
          content: [extractSectionContent(analysisText, 'Executive TL;DR') || 'Bullet-style or short paragraph that delivers instant takeaways.']
        },
        { 
          id: 'topic-frequency',
          title: 'Topic Frequency Table',
          sectionType: 'audience-analysis',
          icon: '📊',
          content: [extractSectionContent(analysisText, 'Topic Frequency Table') || 'Table of the 20 most-used n-grams (1–3 words) across all video transcripts. Include: n-gram, % of videos containing it.']
        },
        { 
          id: 'video-profile',
          title: 'Typical Video Profile',
          sectionType: 'content-strategy',
          icon: '🎬',
          content: [extractSectionContent(analysisText, 'Typical Video Profile') || '• Median duration (min:sec) • Median days between uploads (cadence) • Median engagement ratio (likes+comments)/views expressed as a %.']
        },
        { 
          id: 'sponsor-timeline',
          title: 'Sponsor & Tool Timeline',
          sectionType: 'growth-opportunities',
          icon: '🤝',
          content: [extractSectionContent(analysisText, 'Sponsor & Tool Timeline') || 'For each distinct brand / SaaS / gear reference extracted from transcripts: first mention date, most recent mention date, total #mentions. Show in reverse-chronological table.']
        },
        { 
          id: 'content-gaps',
          title: 'Content Gaps',
          sectionType: 'growth-opportunities',
          icon: '🎯',
          content: [extractSectionContent(analysisText, 'Content Gaps') || '3–5 topics that rival channels in the same niche cover ≥2 × more yet appear in < 5 % of this channel\'s videos. Briefly note why each gap matters.']
        },
        { 
          id: 'format-observations',
          title: 'Format / Style Observations',
          sectionType: 'content-strategy',
          icon: '🎨',
          content: [extractSectionContent(analysisText, 'Format / Style Observations') || '• % of uploads that are Shorts (<60 s) • Average hook length (sec until first substantive point) • Notable editing patterns (e.g., jump-cuts, on-screen text) if detectable.']
        },
        { 
          id: 'title-patterns',
          title: 'Title Pattern Insights',
          sectionType: 'content-strategy',
          icon: '📝',
          content: [extractSectionContent(analysisText, 'Title Pattern Insights') || 'Common title structures (e.g., listicles, questions, "How to X"), average title length, and which patterns over- or under-perform on views vs. median (use ±% delta).']
        },
        { 
          id: 'action-playbook',
          title: 'Action Playbook',
          sectionType: 'growth-opportunities',
          icon: '🚀',
          content: [extractSectionContent(analysisText, 'Action Playbook') || 'Bullet list of next-video ideas, each tied to a specific Content Gap or under-performing format. Make them concrete: include a working title, target length, and hook concept.']
        }
      ]
      
      return sections
      
    } catch (error) {
      console.error('Error parsing channel analysis:', error)
      return []
    }
  }

  // Helper function to extract content for a specific section
  const extractSectionContent = (text, sectionName) => {
    try {
      // Look for section headings and extract content until next section or end
      const cleanSectionName = sectionName.replace(/[()≤]/g, '').trim()
      const patterns = [
        // Try exact match first
        new RegExp(`##\\s*${sectionName}\\s*\\n([\\s\\S]*?)(?=##|$)`, 'i'),
        // Try partial match without special chars
        new RegExp(`##\\s*${cleanSectionName}[^\\n]*\\n([\\s\\S]*?)(?=##|$)`, 'i'),
        // Try keyword-based matching
        new RegExp(`${cleanSectionName}[^\\n]*\\n([\\s\\S]*?)(?=##|$)`, 'i')
      ]
      
      for (const pattern of patterns) {
        const match = text.match(pattern)
        if (match && match[1]) {
          return match[1].trim()
        }
      }
      
      return null
    } catch (error) {
      console.error(`Error extracting ${sectionName}:`, error)
      return null
    }
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
  
  // Parse into predefined channel sections
  const channelSections = parseChannelAnalysis(analysisContent);
  
  // Separate Executive TL;DR section for hero display
  const tldrSection = channelSections.find(section => section.id === 'executive-tldr');
  const otherSections = channelSections.filter(section => section.id !== 'executive-tldr');

  return (
    <div className="content-wrapper">
      {/* Left Rail - Quick Navigation */}
      <div className="left-rail">
        <AnchorRail sections={channelSections} />
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Channel Metadata with KPIs */}
        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h1 className="h1" style={{ margin: 0 }}>
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
        </div>
        
        {/* Channel KPIs */}
        <ChannelKPIs result={result} />
        
        <NavigationTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          tabs={['insights', 'export']}
        />
        
        {/* Enhanced Master Expand/Collapse Controls for Channel Analysis */}
        {type === 'channel' && activeTab === 'insights' && (
          <div className="card" style={{ 
            marginBottom: 'var(--space-4)', 
            padding: 'var(--space-3) var(--space-4)',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '2px solid var(--blue-accent)',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: 'var(--blue-accent)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ChevronDown className="w-4 h-4 text-white" />
                </div>
                <span className="caption" style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                  Master Section Controls
                </span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => setAllSectionsOpen(true)}
                  style={{
                    padding: '6px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: allSectionsOpen ? 'white' : 'var(--blue-accent)',
                    background: allSectionsOpen ? 'var(--blue-accent)' : 'white',
                    border: `2px solid var(--blue-accent)`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: allSectionsOpen ? '0 4px 12px rgba(24, 167, 255, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!allSectionsOpen) {
                      e.target.style.background = 'rgba(24, 167, 255, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!allSectionsOpen) {
                      e.target.style.background = 'white'
                    }
                  }}
                >
                  📖 Expand All
                </button>
                <button
                  onClick={() => setAllSectionsOpen(false)}
                  style={{
                    padding: '6px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: !allSectionsOpen ? 'white' : 'var(--gray-600)',
                    background: !allSectionsOpen ? 'var(--gray-600)' : 'white',
                    border: `2px solid var(--gray-600)`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: !allSectionsOpen ? '0 4px 12px rgba(75, 85, 99, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (allSectionsOpen) {
                      e.target.style.background = 'rgba(75, 85, 99, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (allSectionsOpen) {
                      e.target.style.background = 'white'
                    }
                  }}
                >
                  📕 Collapse All
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div style={{ marginBottom: 'var(--space-4)' }}>
          {activeTab === 'insights' && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              {/* Hero TL;DR Section */}
              {tldrSection && (
                <div className="card" style={{ 
                  background: 'linear-gradient(to right, #fef3c7, #dbeafe)',
                  border: '2px solid #f59e0b',
                  marginBottom: 'var(--space-6)'
                }}>
                  <div className="section-head">
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: '#f59e0b', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {tldrSection.icon}
                    </div>
                    <h2 className="h1" style={{ margin: 0, color: '#f59e0b' }}>
                      {tldrSection.title}
                    </h2>
                  </div>
                  <div className="prose-enhanced body" style={{ lineHeight: '1.6' }}>
                    <ReactMarkdown>{tldrSection.content.join('\n')}</ReactMarkdown>
                  </div>
                </div>
              )}
              
              {/* Channel Analysis Sections */}
              {otherSections.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {otherSections.map((section, index) => (
                    <ContentCard
                      key={section.id}
                      id={section.id}
                      title={`${section.icon} ${section.title}`}
                      content={section.content.join('\n')}
                      defaultOpen={allSectionsOpen}
                      forceOpen={allSectionsOpen}
                      designSystem={true}
                      sectionType={section.sectionType}
                    />
                  ))}
                </div>
              )}
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