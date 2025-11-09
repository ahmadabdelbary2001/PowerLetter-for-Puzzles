// src/components/atoms/Notification.tsx
/**
 * Notification - A standardized, self-translating notification component.
 * It receives a messageKey and interpolation options, and translates them.
 */
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/hooks/useNotification';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationData {
  messageKey: string;
  type?: NotificationType;
  duration?: number;
  options?: Record<string, string | number>; // For interpolation
}

interface NotificationProps extends NotificationData {
  onClose: () => void;
  className?: string;
}

export function Notification({
  messageKey,
  options,
  type = 'info',
  duration = 3000,
  onClose,
  className,
}: NotificationProps) {
  const { tNotification } = useNotification();
  const [visible, setVisible] = useState(false);

  // Build message via translation function (with interpolation options)
  const message = tNotification ? tNotification(messageKey, options) : messageKey;

  // timers: one to trigger hide, another to call onClose after animation
  useEffect(() => {
    // trigger enter animation
    const enterTimeout = setTimeout(() => setVisible(true), 10);

    let hideTimer: number | undefined;
    if (duration > 0) {
      hideTimer = window.setTimeout(() => {
        setVisible(false);
      }, duration);
    }

    return () => {
      clearTimeout(enterTimeout);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [duration]);

  // when visible becomes false, wait for animation duration (300ms) then call onClose
  useEffect(() => {
    if (!visible) {
      const afterAnim = setTimeout(() => {
        onClose();
      }, 320); // slightly longer than CSS transition
      return () => clearTimeout(afterAnim);
    }
    // no cleanup when visible true
    return;
  }, [visible, onClose]);

  const icon =
    type === 'success' ? <CheckCircle className="h-5 w-5" />
    : type === 'error' ? <XCircle className="h-5 w-5" />
    : type === 'warning' ? <AlertTriangle className="h-5 w-5" />
    : <Info className="h-5 w-5" />;

  const accent =
    type === 'success' ? 'border-green-400/80'
    : type === 'error' ? 'border-rose-400/80'
    : type === 'warning' ? 'border-amber-400/80'
    : 'border-sky-400/80';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        // fixed, centered, and responsive container so notification floats at a single height
        'fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-auto',
        className
      )}
    >
      <div
        // animated card
        className={cn(
          'transform transition-all duration-300 ease-out',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
          // card visuals: soft glass blur, rounded, shadow, left accent border
          'rounded-xl shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-800/80 border-l-4',
          accent
        )}
      >
        <div className="flex items-start gap-3 p-3">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/30 dark:bg-black/20">
            {icon}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white break-words">
              {message}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close notification"
            onClick={() => setVisible(false)}
            className="ml-2 inline-flex items-center justify-center rounded-md p-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
