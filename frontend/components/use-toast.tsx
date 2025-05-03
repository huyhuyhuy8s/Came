"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ToastProps {
  title: string
  description?: string
  duration?: number
}

let toastId = 0

export function toast({ title, description, duration = 3000 }: ToastProps) {
  const id = ++toastId
  const event = new CustomEvent("toast", {
    detail: {
      id,
      title,
      description,
      duration,
    },
  })
  document.dispatchEvent(event)
  return id
}

export function Toaster() {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([])

  useEffect(() => {
    const handleToast = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setToasts((prev) => [...prev, detail])

      if (detail.duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== detail.id))
        }, detail.duration)
      }
    }

    document.addEventListener("toast", handleToast)
    return () => document.removeEventListener("toast", handleToast)
  }, [])

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 md:bottom-4 md:right-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="flex w-full max-w-sm items-start gap-2 rounded-lg bg-white p-4 shadow-lg">
          <div className="flex-1">
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="text-sm text-gray-500">{toast.description}</p>}
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      ))}
    </div>
  )
}
