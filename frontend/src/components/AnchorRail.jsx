import { useState, useEffect } from 'react'

function AnchorRail({ sections }) {
  const [activeSection, setActiveSection] = useState('')
  const [allExpanded, setAllExpanded] = useState(false)

  const handleScrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleExpandAll = () => {
    setAllExpanded(!allExpanded)
    // Trigger expand/collapse for all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element) {
        const button = element.querySelector('button')
        if (button) {
          // This would need to be coordinated with ContentCard state
          // For now, just scroll to show the effect
          if (!allExpanded) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }
      }
    })
  }

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for sticky header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          
          if (scrollPosition >= elementTop) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  return (
    <nav className="hidden lg:block sticky top-24 h-fit quick-nav">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <h3 className="caption" style={{ fontWeight: 600, color: 'var(--gray-900)', margin: 0 }}>
          Quick Navigation
        </h3>
        <button
          onClick={handleExpandAll}
          className="caption"
          style={{ 
            color: 'var(--blue-accent)', 
            fontWeight: 600,
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
          title={allExpanded ? 'Collapse all sections' : 'Expand all sections'}
        >
          {allExpanded ? 'Collapse' : 'Expand'} all
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleScrollTo(section.id)}
            className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
            title={`Jump to ${section.title}`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              display: 'block'
            }}
          >
            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {section.title}
            </span>
          </button>
        ))}
      </div>

      {/* Progress indicator */}
      <div style={{ 
        marginTop: 'var(--space-4)', 
        paddingTop: 'var(--space-3)', 
        borderTop: '1px solid var(--gray-200)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: 'var(--gray-200)', 
            borderRadius: '3px',
            marginRight: 'var(--space-2)',
            overflow: 'hidden'
          }}>
            <div 
              style={{ 
                height: '100%',
                background: 'var(--blue-accent)',
                borderRadius: '3px',
                transition: 'width 0.3s ease',
                width: `${sections.length > 0 ? ((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100 : 0}%`
              }}
            />
          </div>
          <span className="caption" style={{ color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>
            {sections.findIndex(s => s.id === activeSection) + 1}/{sections.length}
          </span>
        </div>
      </div>
    </nav>
  )
}

export default AnchorRail