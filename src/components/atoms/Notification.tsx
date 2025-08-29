// src/components/atoms/Notification.tsx
/**
 * Notification - A standardized notification component used across games.
 *
 * - Accepts message, type, optional duration (ms) and onClose callback.
 * - If `duration` is provided (> 0) the component will auto-close and call onClose.
 * - Keeps styling consistent (floating centered bar) for all games.
 */

import { useEffect } from "react";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationProps {
  message: string;
  type?: NotificationType;
  /** Duration in milliseconds. If > 0, Notification calls onClose after duration. */
  duration?: number;
  /** Optional callback invoked when notification auto-closes (or when parent wants to close). */
  onClose?: () => void;
  className?: string;
}

export function Notification({
  message,
  type = "info",
  duration = 0,
  onClose,
  className,
}: NotificationProps) {
  useEffect(() => {
    if (duration && duration > 0 && onClose) {
      const id = setTimeout(() => onClose(), duration);
      return () => clearTimeout(id);
    }
    return;
  }, [duration, onClose]);

  const bg =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-blue-600";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg z-50 text-sm sm:text-base text-white transition-all duration-200",
        bg,
        className
      )}
    >
      {message}
    </div>
  );
}

export default Notification;

