import { useState } from 'react'
import { Copy, Download, Share, FileText, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

function UtilityBar({ result, type }) {
  const [copied, setCopied] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  const handleCopyAll = async () => {
    try {
      const textToCopy = type === 'video' ? result.summary : JSON.stringify(result.analysis, null, 2)
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setShowCopyToast(true)
      setTimeout(() => {
        setCopied(false)
        setShowCopyToast(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const handleDownloadMarkdown = () => {
    const content = type === 'video' ? result.summary : JSON.stringify(result.analysis, null, 2)
    const blob = new Blob([content], { type: 'text/markdown' })
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `contentminer-${type}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  }

  const handleDownloadTxt = () => {
    const content = type === 'video' ? result.summary : JSON.stringify(result.analysis, null, 2)
    const blob = new Blob([content], { type: 'text/plain' })
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `contentminer-${type}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  }

  const handleDownloadPDF = () => {
    // Placeholder for PDF export functionality
    alert('PDF export coming soon!')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${type === 'video' ? 'Video Summary' : 'Channel Analysis'} - ContentMiner`,
          text: `Check out this ${type} analysis from ContentMiner`,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href)
      setShowCopyToast(true)
      setTimeout(() => setShowCopyToast(false), 2000)
    }
  }

  return (
    <aside className="hidden lg:flex flex-col sticky top-24 h-fit right-rail">
      <h3 className="caption" style={{ fontWeight: 600, color: 'var(--gray-900)', marginBottom: 'var(--space-3)' }}>
        Actions
      </h3>
      
      {/* Copy Group */}
      <div className="action-group">
        <button
          onClick={handleCopyAll}
          className="action-button card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            background: 'white',
            border: '1px solid var(--gray-300)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--gray-700)',
            cursor: 'pointer'
          }}
          title="Copy all content to clipboard"
        >
          {copied ? (
            <CheckCircle className="w-4 h-4 mr-2" style={{ color: 'var(--blue-accent)' }} />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Export Group */}
      <div className="action-group">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <button
            onClick={() => setExportOpen(!exportOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 20px',
              background: 'white',
              border: 'none',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--gray-700)',
              cursor: 'pointer'
            }}
            title="Export options"
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </div>
            {exportOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {exportOpen && (
            <div style={{ borderTop: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
              <button
                onClick={handleDownloadMarkdown}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '8px 20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  color: 'var(--gray-600)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--gray-900)'
                  e.target.style.background = 'var(--gray-100)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--gray-600)'
                  e.target.style.background = 'none'
                }}
                title="Download as Markdown file"
              >
                <FileText className="w-4 h-4 mr-2" />
                Markdown
              </button>
              <button
                onClick={handleDownloadTxt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '8px 20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  color: 'var(--gray-600)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--gray-900)'
                  e.target.style.background = 'var(--gray-100)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--gray-600)'
                  e.target.style.background = 'none'
                }}
                title="Download as text file"
              >
                <FileText className="w-4 h-4 mr-2" />
                Text
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '8px 20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  color: 'var(--gray-600)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--gray-900)'
                  e.target.style.background = 'var(--gray-100)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--gray-600)'
                  e.target.style.background = 'none'
                }}
                title="Download as PDF (coming soon)"
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share Group */}
      <div className="action-group">
        <button
          onClick={handleShare}
          className="action-button card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            background: 'rgba(24, 167, 255, 0.05)',
            border: '1px solid rgba(24, 167, 255, 0.2)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--blue-accent)',
            cursor: 'pointer'
          }}
          title="Share this analysis"
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </button>
      </div>

      {/* Toast notification */}
      {showCopyToast && (
        <div style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 50,
          background: 'var(--blue-accent)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied to clipboard!
        </div>
      )}
    </aside>
  )
}

export default UtilityBar