import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

// Lazy load components for better performance
const Home = lazy(() => import('./components/Home').catch(() => ({ 
  default: () => <div>Home component could not be loaded</div> 
})))

const Chat = lazy(() => import('./components/Chat').catch(() => ({ 
  default: () => <div>Chat component could not be loaded</div> 
})))

const NotFound = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100vh',
    textAlign: 'center'
  }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
      Go back to Home
    </a>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:girlName" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
