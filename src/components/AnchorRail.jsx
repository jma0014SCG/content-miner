function AnchorRail({ sections }) {
  const handleScrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="hidden lg:block sticky top-24 space-y-3 h-fit">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Navigation</h3>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleScrollTo(section.id)}
          className="block w-full text-left text-sm text-gray-600 hover:text-emerald-600 transition-colors py-1"
        >
          {section.title}
        </button>
      ))}
    </nav>
  )
}

export default AnchorRail