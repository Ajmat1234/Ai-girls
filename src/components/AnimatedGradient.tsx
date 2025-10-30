import React from "react"
import clsx from "clsx"
import "../styles/animations.css"

export default function AnimatedGradient({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={clsx("gradient-animated", className)}
      style={{ pointerEvents: "none" }}
    />
  )
}
