import { useState } from 'react'
import { Copy, Download, Share, FileText, CheckCircle } from 'lucide-react'

function UtilityBar({ result, type }) {
  const [copied, setCopied] = useState(false)

  const handleCopyAll = async () => {
    try {
      const textToCopy = type === 'video' ? result.summary : JSON.stringify(result.analysis, null, 2)
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
    a.download = `insight-${type}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  }

  const handleDownloadPDF = () => {
    // This would implement PDF export functionality
    console.log('PDF export not yet implemented')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Video Summary',
          text: 'Check out this video summary',
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <aside className="hidden lg:flex flex-col sticky top-24 space-y-4 h-fit">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Actions</h3>
      
      <button
        onClick={handleCopyAll}
        className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {copied ? (
          <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        {copied ? 'Copied!' : 'Copy All'}
      </button>

      <button
        onClick={handleDownloadMarkdown}
        className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Markdown
      </button>

      <button
        onClick={handleDownloadPDF}
        className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FileText className="w-4 h-4 mr-2" />
        PDF
      </button>

      <button
        onClick={handleShare}
        className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
      >
        <Share className="w-4 h-4 mr-2" />
        Share
      </button>
    </aside>
  )
}

export default UtilityBar