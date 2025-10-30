import React, { Suspense, lazy } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'

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
  <div style={{ textAlign: 'center', paddingTop: '50px' }}>
    <h1>404</h1>
    <p>Page Not Found</p>
  </div>
)

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
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
