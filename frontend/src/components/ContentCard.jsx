import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ChevronDown, ChevronUp, Copy, Clock, Target, Users, TrendingUp, Lightbulb, BarChart3 } from 'lucide-react'

function ContentCard({ id, title, content, defaultOpen = false, enhanced = false, designSystem = false, forceOpen, sectionType }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  // Handle forced open/close state
  React.useEffect(() => {
    if (forceOpen !== undefined) {
      setIsOpen(forceOpen)
    }
  }, [forceOpen])
  const [copied, setCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setShowToast(true)
      setTimeout(() => {
        setCopied(false)
        setShowToast(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Convert dense prose to bullet points (>120 chars per bullet)
  // Get section-specific styling and icons
  const getSectionConfig = (sectionType, title) => {
    // Auto-detect section type from title if not provided
    const titleLower = (title || '').toLowerCase()
    const detectedType = sectionType || 
      (titleLower.includes('content') && titleLower.includes('strategy') ? 'content-strategy' :
       titleLower.includes('audience') || titleLower.includes('demographics') ? 'audience-analysis' :
       titleLower.includes('growth') || titleLower.includes('opportunities') ? 'growth-opportunities' :
       titleLower.includes('insights') ? 'insights' :
       'default')

    const configs = {
      'content-strategy': {
        icon: Target,
        color: '#8b5cf6',
        bgGradient: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
        borderColor: '#8b5cf6'
      },
      'audience-analysis': {
        icon: Users,
        color: '#06b6d4',
        bgGradient: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)',
        borderColor: '#06b6d4'
      },
      'growth-opportunities': {
        icon: TrendingUp,
        color: '#059669',
        bgGradient: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
        borderColor: '#059669'
      },
      'insights': {
        icon: Lightbulb,
        color: '#f59e0b',
        bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        borderColor: '#f59e0b'
      },
      'default': {
        icon: BarChart3,
        color: 'var(--gray-600)',
        bgGradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderColor: 'var(--gray-300)'
      }
    }

    return configs[detectedType] || configs.default
  }

  const processContent = (text) => {
    // First handle timestamps
    let processed = text.replace(/(\d{1,2}:\d{2})/g, (match) => {
      return `[⏱️ ${match}](javascript:void(0))`
    })

    // Convert dense paragraphs to bullets when they contain multiple clauses
    if (designSystem) {
      processed = processed.replace(/([^.\n]*[,;][^.\n]*[,;][^.\n]*\.)/g, (match) => {
        const sentences = match.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0)
        if (sentences.length > 2) {
          return '\n' + sentences.map(s => `• ${s.replace(/\.$/, '')}`).join('\n') + '\n'
        }
        return match
      })
    }

    return processed
  }

  if (designSystem) {
    const sectionConfig = getSectionConfig(sectionType, title)
    const IconComponent = sectionConfig.icon

    return (
      <div 
        id={id} 
        className="card" 
        style={{
          background: sectionConfig.bgGradient,
          border: `2px solid ${sectionConfig.borderColor}`,
          transition: 'all 0.3s ease'
        }}
      >
        <div className="section-head">
          <div style={{
            width: '32px',
            height: '32px',
            background: sectionConfig.color,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <h3 className="h3" style={{ margin: 0, flex: 1, color: sectionConfig.color }}>
            {title}
          </h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
            style={{ marginLeft: 'auto' }}
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-100 rounded transition-colors ml-2"
            title="Copy section content"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <div 
          className={`transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          style={{ 
            maxHeight: isOpen ? '9999px' : '0',
            overflow: isOpen ? 'visible' : 'hidden',
            transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease-in-out'
          }}
        >
          <div className="prose-enhanced" style={{ width: '100%', minWidth: 0 }}>
            <ReactMarkdown
              components={{
                // Design system typography
                h1: ({ children }) => <h1 className="h1">{children}</h1>,
                h2: ({ children }) => <h2 className="h2">{children}</h2>,
                h3: ({ children }) => <h3 className="h3">{children}</h3>,
                p: ({ children }) => <p className="body">{children}</p>,
                ul: ({ children }) => (
                  <ul className="list-disc pl-5" style={{ marginTop: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="body" style={{ marginBottom: 'var(--space-1)', maxWidth: '120ch' }}>
                    {children}
                  </li>
                ),
                code: ({ children }) => <code className="code">{children}</code>,
                // Timestamp buttons
                a: ({ node, href, children, ...props }) => {
                  if (href === 'javascript:void(0)' && children[0]?.toString().includes('⏱️')) {
                    return (
                      <button
                        onClick={() => {
                          const timestamp = children[0].toString().replace('⏱️ ', '')
                          console.log('Jump to:', timestamp)
                        }}
                        className="timestamp inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors mx-1"
                        title={`Jump to ${timestamp}`}
                        {...props}
                      >
                        {children}
                      </button>
                    )
                  }
                  return <a href={href} className="text-blue-600 hover:text-blue-700 underline" {...props}>{children}</a>
                }
              }}
            >
              {processContent(content)}
            </ReactMarkdown>
          </div>
        </div>

        {showToast && (
          <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied to clipboard!
          </div>
        )}
      </div>
    )
  }

  // Fallback to original enhanced styling
  const cardClasses = enhanced 
    ? "rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-xl hover:border-emerald-200 transition-all duration-200"
    : "rounded-2xl shadow-sm bg-white/90 backdrop-blur border border-gray-100 hover:shadow-md transition-shadow"

  const titleClasses = enhanced
    ? "text-xl font-bold text-gray-900 mr-3 leading-tight"
    : "text-lg font-semibold text-gray-900 mr-3"

  const proseClasses = enhanced
    ? "prose prose-lg max-w-none text-gray-800 leading-relaxed"
    : "prose prose-lg max-w-none text-gray-700"

  return (
    <div 
      id={id}
      className={cardClasses}
    >
      <div className={enhanced ? "p-8" : "p-6"}>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center flex-1 text-left group"
            title={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
          >
            <h3 className={titleClasses}>
              {title}
            </h3>
            <div className="ml-auto flex items-center">
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              )}
            </div>
          </button>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
              title="Copy section content"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          style={{ 
            maxHeight: isOpen ? 'none' : '0',
            overflow: isOpen ? 'visible' : 'hidden'
          }}
        >
          <div className={proseClasses} style={{ width: '100%', minWidth: 0, overflowWrap: 'break-word' }}>
            <ReactMarkdown
              components={{
                // Enhanced typography
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-gray-900">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-medium mb-3 text-gray-900">{children}</h3>,
                p: ({ children }) => <p className="mb-4 text-base leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-base leading-relaxed">{children}</li>,
                // Custom renderer for timestamp links
                a: ({ node, href, children, ...props }) => {
                  if (href === 'javascript:void(0)' && children[0]?.toString().includes('⏱️')) {
                    return (
                      <button
                        onClick={() => {
                          // Extract timestamp and open YouTube at that time
                          const timestamp = children[0].toString().replace('⏱️ ', '')
                          console.log('Jump to:', timestamp)
                        }}
                        className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-200 transition-colors mx-1"
                        title={`Jump to ${timestamp}`}
                        {...props}
                      >
                        {children}
                      </button>
                    )
                  }
                  return <a href={href} className="text-emerald-600 hover:text-emerald-700 underline" {...props}>{children}</a>
                }
              }}
            >
              {processContent(content)}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-pulse">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied to clipboard!
        </div>
      )}
    </div>
  )
}

export default ContentCard