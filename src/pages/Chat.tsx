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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Girl not found</h2>
          <p className="text-sm text-gray-500 mb-4">Invalid or missing girl ID.</p>
          <button
            className="px-4 py-2 rounded bg-indigo-600 text-white"
            onClick={() => navigate("/")}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto h-screen flex flex-col">
        <ChatInterface girl={girl} />
      </div>
    </div>
  );
}
