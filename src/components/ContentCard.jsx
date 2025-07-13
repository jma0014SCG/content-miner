import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ChevronDown, ChevronUp, Copy, Clock } from 'lucide-react'

function ContentCard({ id, title, content, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Extract timestamps from content and make them clickable
  const processContent = (text) => {
    return text.replace(/(\d{1,2}:\d{2})/g, (match) => {
      return `[⏱️ ${match}](javascript:void(0))`
    })
  }

  return (
    <div 
      id={id}
      className="rounded-2xl shadow-sm bg-white/90 backdrop-blur border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center flex-1 text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mr-3">
              {title}
            </h3>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy section"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div 
          className={`overflow-hidden accordion-content ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="prose prose-lg max-w-none text-gray-700">
            <ReactMarkdown
              components={{
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
                        className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium hover:bg-emerald-200 transition-colors"
                        {...props}
                      >
                        {children}
                      </button>
                    )
                  }
                  return <a href={href} {...props}>{children}</a>
                }
              }}
            >
              {processContent(content)}
            </ReactMarkdown>
          </div>
        </div>
        
        {copied && (
          <div className="mt-2 text-sm text-emerald-600">
            ✓ Copied to clipboard
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentCard