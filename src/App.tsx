import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-1">Loading your AI companion...</h2>
          <p className="text-sm text-gray-500">Just a moment!</p>
        </div>
      </div>
    </div>
  );
}

const Home = lazy(() => import("./pages/Index"));
const Chat = lazy(() => import("./pages/Chat"));

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! Page Not Found</p>
      <button 
        onClick={() => window.location.href = "/"} 
        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
      >
        Go Home
      </button>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat/:girlId" element={<Chat />} />  {/* <-- ये fix: :girlId add किया */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
