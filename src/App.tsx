import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

function LoadingScreen() {
  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      Loading...
    </div>
  );
}

const Home = lazy(() => import("./pages/Index"));
const Chat = lazy(() => import("./pages/Chat"));

const NotFound = () => (
  <div style={{ textAlign: "center", paddingTop: "50px" }}>
    <h1>404</h1>
    <p>Page Not Found</p>
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
