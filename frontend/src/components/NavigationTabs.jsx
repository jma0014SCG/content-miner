function NavigationTabs({ activeTab, onTabChange, tabs }) {
  const tabLabels = {
    highlights: 'Highlights',
    transcript: 'Transcript', 
    timeline: 'Timeline',
    export: 'Export'
  }

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default NavigationTabs