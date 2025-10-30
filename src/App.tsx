import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'

const Home = lazy(() =>
  import('./pages/Index').catch(() => ({
    default: () => <div>Home component could not be loaded</div>,
  }))
)

const Chat = lazy(() =>
  import('./pages/Chat').catch(() => ({
    default: () => <div>Chat component could not be loaded</div>,
  }))
)

const NotFound = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      fontFamily: 'sans-serif',
    }}
  >
    <h1>404</h1>
    <p>Page Not Found</p>
  </div>
)

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
}

export default App
