// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // you can also send this to an external logging service
    // console.error is fine for now
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Kuch galt ho gaya</h2>
            <p className="text-sm text-gray-600 mb-4">
              Hum is issue ko dekh rahe hain. Agar aap developer ho to console check karo.
            </p>
            <details className="text-left text-xs text-gray-500">
              <summary className="cursor-pointer">Error details (click)</summary>
              <pre className="whitespace-pre-wrap mt-2 text-xs">
                {String(this.state.error || "No details")}
              </pre>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
