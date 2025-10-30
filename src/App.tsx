import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen text-xl font-semibold">
      Loading...
    </div>
  );
}

const Home = lazy(() => import("./pages/Index"));
const Chat = lazy(() => import("./pages/Chat"));

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-5xl font-bold mb-4">404</h1>
    <p className="text-lg text-gray-600">Page Not Found</p>
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
              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
