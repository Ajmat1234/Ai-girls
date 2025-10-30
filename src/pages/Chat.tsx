// src/pages/Chat.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { girls } from "../data/girls";
import ChatInterface from "../components/ChatInterface";
import { useAuth } from "../hooks/useAuth";

export default function ChatPage() {
  const params = useParams<{ girlId?: string }>();
  const girlId = params.girlId || "";
  const navigate = useNavigate();
  const { user, loginAsGuest } = useAuth();

  const girl = girls.find((g) => g.id === girlId);

  // If not logged in, create a guest user (keeps original behavior)
  React.useEffect(() => {
    if (!user) {
      loginAsGuest && loginAsGuest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!girl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="text-center p-4">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Girl not found</h2>
          <p className="text-sm text-gray-500 mb-4">Invalid or missing girl ID.</p>
          <button
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
            onClick={() => navigate("/")}
          >
            Go back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">  {/* Removed bg-gray-50 and h-screen to avoid conflict */}
      <div className="max-w-4xl mx-auto">  {/* Slightly wider for better mobile */}
        <ChatInterface girl={girl} />
      </div>
    </div>
  );
}
