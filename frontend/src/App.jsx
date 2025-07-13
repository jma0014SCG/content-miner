import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ResultPage from './pages/ResultPage'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </div>
  )
}

export default App