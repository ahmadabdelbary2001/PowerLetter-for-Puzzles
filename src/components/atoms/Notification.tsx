// src/components/atoms/Notification.tsx
/**
 * Notification - A component for displaying temporary notifications
 *
 * This component renders a notification that appears at the top of the screen
 * and disappears after a specified duration. It supports different types of notifications
 * with different colors.
 */
import { cn } from "@/lib/utils"

/**
 * Props for the Notification component
 */
interface NotificationProps {
  /** The message to display in the notification */
  message: string
  /** The type of the notification */
  type?: 'success' | 'error' | 'warning' | 'info'
  /** Additional CSS classes for custom styling */
  className?: string
}

/**
 * Notification component - Displays a temporary notification
 *
 * This component is used to display temporary notifications to the user.
 * It supports different types of notifications with different colors and animations.
 * The notification automatically disappears after a specified duration.
 */
export function Notification({
  message,
  type = 'info',
  className
}: NotificationProps) {
  // Determine the background color based on the type
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className={cn(
      "fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300",
      getBgColor(),
      className
    )}>
      {message}
    </div>
  );
}
