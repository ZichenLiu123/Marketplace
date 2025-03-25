
import { useState, useCallback } from 'react'
import { toast as sonnerToast, type ToastT } from 'sonner'

type ToasterToast = ToastT & {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const useToast = () => {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  const toast = useCallback(
    function ({
      ...props
    }: Omit<ToasterToast, "id">) {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((toasts) => [
        ...toasts,
        { id, ...props },
      ])
      return id
    },
    [setToasts]
  )

  return {
    toast,
    toasts,
    setToasts,
  }
}

// Export the hook and the direct sonner toast function
export { useToast }
export { sonnerToast as toast }
