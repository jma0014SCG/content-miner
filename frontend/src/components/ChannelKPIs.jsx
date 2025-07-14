import { Users, PlayCircle, Calendar, TrendingUp, Eye, Clock } from 'lucide-react'

function ChannelKPIs({ result }) {
  // Early return if no result to prevent errors
  if (!result) {
    return <div className="kpi-grid">
      <div className="kpi-card">
        <span className="kpi-label">Loading KPIs...</span>
      </div>
    </div>
  }

  // Extract KPI data from channel analysis result
  const extractKPIs = () => {
    try {
      const metadata = result?.metadata || {}
      const analysis = result?.analysis || {}
      
      // Parse key metrics from metadata or analysis text
      const kpis = {
        subscribers: metadata.subscriber_count || extractFromText(analysis, /(\d+(?:,\d+)*|\d+(?:\.\d+)?[KMB]?)\s*subscribers?/i),
        videos: metadata.video_count || extractFromText(analysis, /(\d+(?:,\d+)*)\s*videos?/i),
        views: metadata.total_views || extractFromText(analysis, /(\d+(?:,\d+)*|\d+(?:\.\d+)?[KMB]?)\s*(?:total\s+)?views?/i),
        avgViews: extractFromText(analysis, /(\d+(?:,\d+)*|\d+(?:\.\d+)?[KMB]?)\s*(?:average|avg)\s*views?/i),
        engagement: extractFromText(analysis, /(\d+(?:\.\d+)?%)\s*engagement/i),
        uploadFreq: extractFromText(analysis, /(\d+(?:\.\d+)?)\s*(?:videos?\s+per\s+(?:week|month)|uploads?\s+per\s+(?:week|month))/i)
      }
      
      return kpis
    } catch (error) {
      console.error('Error extracting KPIs:', error)
      return {
        subscribers: null,
        videos: null,
        views: null,
        avgViews: null,
        engagement: null,
        uploadFreq: null
      }
    }
  }
  
  const extractFromText = (text, regex) => {
    if (typeof text !== 'string') return null
    const match = text.match(regex)
    return match ? match[1] : null
  }
  
  const formatNumber = (value) => {
    if (!value) return 'N/A'
    
    // Handle already formatted values (like "1.2M")
    if (typeof value === 'string' && /[KMB]/.test(value)) {
      return value
    }
    
    // Convert string numbers with commas to actual numbers
    const num = typeof value === 'string' ? 
      parseInt(value.replace(/,/g, '')) : value
    
    if (isNaN(num)) return value || 'N/A'
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
  }
  
  const kpis = extractKPIs()
  
  return (
    <div className="kpi-grid">
      {/* Subscribers */}
      <div className="kpi-card primary">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
          <Users className="w-5 h-5" style={{ color: 'var(--blue-accent)', marginRight: 'var(--space-1)' }} />
          <span className="kpi-label">Subscribers</span>
        </div>
        <div className="kpi-large">{formatNumber(kpis.subscribers)}</div>
      </div>
      
      {/* Video Count */}
      <div className="kpi-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
          <PlayCircle className="w-5 h-5" style={{ color: 'var(--gray-600)', marginRight: 'var(--space-1)' }} />
          <span className="kpi-label">Videos</span>
        </div>
        <div className="kpi-medium">{formatNumber(kpis.videos)}</div>
      </div>
      
      {/* Total Views */}
      <div className="kpi-card success">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
          <Eye className="w-5 h-5" style={{ color: '#059669', marginRight: 'var(--space-1)' }} />
          <span className="kpi-label">Total Views</span>
        </div>
        <div className="kpi-medium">{formatNumber(kpis.views)}</div>
      </div>
      
      {/* Average Views */}
      {kpis.avgViews && (
        <div className="kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--gray-600)', marginRight: 'var(--space-1)' }} />
            <span className="kpi-label">Avg Views</span>
          </div>
          <div className="kpi-medium">{formatNumber(kpis.avgViews)}</div>
        </div>
      )}
      
      {/* Engagement Rate */}
      {kpis.engagement && (
        <div className="kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--gray-600)', marginRight: 'var(--space-1)' }} />
            <span className="kpi-label">Engagement</span>
          </div>
          <div className="kpi-medium">{kpis.engagement}</div>
        </div>
      )}
      
      {/* Upload Frequency */}
      {kpis.uploadFreq && (
        <div className="kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
            <Clock className="w-5 h-5" style={{ color: 'var(--gray-600)', marginRight: 'var(--space-1)' }} />
            <span className="kpi-label">Upload Rate</span>
          </div>
          <div className="kpi-medium">{kpis.uploadFreq}</div>
        </div>
      )}
    </div>
  )
}

export default ChannelKPIs