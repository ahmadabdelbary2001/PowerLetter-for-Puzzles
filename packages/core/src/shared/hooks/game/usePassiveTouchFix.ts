"use client";

// src/features/letter-flow-game/hooks/usePassiveTouchFix.ts
/**
 * This hook addresses an issue with passive event listeners in mobile browsers.
 * Some browsers (like iOS Safari) treat touch event listeners as passive by default,
 * which prevents calling `preventDefault()` on them. This can interfere with
 * game controls that need to prevent default touch behaviors.
 */

import { useEffect } from 'react';

/**
 * Custom React hook to fix passive touch event listeners
 */
/* global EventListenerOrEventListenerObject, AddEventListenerOptions */
export function usePassiveTouchFix() {
  useEffect(() => {
    // Store the original addEventListener method
    const originalAddEventListener: EventTarget['addEventListener'] = EventTarget.prototype.addEventListener;

    // Replace with wrapper that ensures non-passive when options is an object and caller expects non-passive
    EventTarget.prototype.addEventListener = function (
      this: EventTarget,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      // Check if this is a touch event and options is an object without passive property
      if (
        (type === 'touchmove' || type === 'touchstart' || type === 'touchend') &&
        typeof options === 'object' &&
        options &&
        !('passive' in options)
      ) {
        // Create new options with passive set to false
        const newOptions = { ...(options as AddEventListenerOptions), passive: false };
        return originalAddEventListener.call(this, type, listener, newOptions);
      }
      
      // For non-touch events or when passive is already specified, use original method
      return originalAddEventListener.call(this, type, listener, options);
    };

    // Cleanup function to restore the original addEventListener method
    return () => {
      EventTarget.prototype.addEventListener = originalAddEventListener;
    };
  }, []);
}
