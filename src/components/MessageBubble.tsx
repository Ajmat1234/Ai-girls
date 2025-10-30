import React, { useEffect, useRef, useState } from "react"
import clsx from "clsx"

interface MessageProps {
  id: string
  sender: "user" | "ai"
  text: string
  timestamp: Date
  onTriggerBurn?: (id: string) => void
  onCopy?: (text: string) => void
}

const EMOTIONAL_PHRASES = [
  "i love you", "love you", "i miss you", "miss you", "i need you", "i'm in love", "i am in love"
]

export default function MessageBubble({ id, sender, text, timestamp, onTriggerBurn, onCopy }: MessageProps) {
  const [isEmotional, setIsEmotional] = useState(false)
  const [isFire, setIsFire] = useState(false)
  const [isBurned, setIsBurned] = useState(false)
  const [showCopy, setShowCopy] = useState(false)
  const tapRef = useRef({ count: 0, timer: 0 as any })

  useEffect(() => {
    const lower = text.toLowerCase()
    const match = EMOTIONAL_PHRASES.some(p => lower.includes(p))
    setIsEmotional(match)
  }, [text])

  useEffect(() => {
    if (isEmotional) {
      const t = setTimeout(() => {
        // Animation end
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [isEmotional])

  const handleTap = (e: React.PointerEvent) => {
    e.preventDefault()
    tapRef.current.count += 1
    if (tapRef.current.count === 1) {
      tapRef.current.timer = window.setTimeout(() => {
        tapRef.current.count = 0
      }, 700)
    } else if (tapRef.current.count === 3) {
      window.clearTimeout(tapRef.current.timer)
      tapRef.current.count = 0
      setIsFire(true)
      onTriggerBurn?.(id)
      setTimeout(() => {
        setIsBurned(true)
        setIsFire(false)
      }, 2400)
    }
  }

  const handleCopy = () => {
    onCopy?.(text)
    setShowCopy(false)
  }

  return (
    <div
      onPointerDown={handleTap}
      className={clsx(
        "relative max-w-[80%] break-words p-3 rounded-3xl shadow-md transition-all",
        sender === "user" ? "ml-auto text-white" : "mr-auto text-gray-900 dark:text-white",
        isEmotional && "message-emotional message-sent-animate",
        isFire && "message-fire",
        isBurned && "message-burned"
      )}
    >
      {/* Fire layer */}
      {isFire && (
        <div className="fire-layer">
          <div className="flame"></div>
          <div className="flame f2"></div>
          <div className="flame f3"></div>
          <div className="ember" style={{ left: "18%", animationDelay: "120ms" }}></div>
          <div className="ember" style={{ left: "52%", animationDelay: "250ms" }}></div>
          <div className="ember" style={{ left: "78%", animationDelay: "80ms" }}></div>
        </div>
      )}

      {/* Message content */}
      <div className="text-sm">
        {text}
      </div>

      {/* Timestamp */}
      <div className="text-[11px] opacity-70 mt-1 text-right">
        {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>

      {/* Copy Popup on Single Tap */}
      {showCopy && (
        <div className="copy-popup">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs">
            Copy Message
          </Button>
        </div>
      )}
    </div>
  )
}
