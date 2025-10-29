"use client"

import * as React from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg border group-[.toast:loading]:bg-background group-[.toast:loading]:text-foreground",
        description: "group-[.toast:loading]:text-muted-foreground",
        actionButton:
          "group-[.toast:loading]:group-[.toast]:bg-background group-[.toast:loading]:group-[.toast]:text-foreground",
        cancelButton:
          "group-[.toast:loading]:group-[.toast]:bg-background group-[.toast:loading]:group-[.toast]:text-foreground",
      },
      style: {
        background: "linear-gradient(to right, #fef3f2, #fce7f3)",  // Pink gradient for theme
        border: "1px solid #f472b6",  // Pink border
      },
    }}
    {...props}
  />
)

export { Toaster }
