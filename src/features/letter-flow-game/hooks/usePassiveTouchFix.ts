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
 * 
 * This hook monkey-patches the EventTarget.prototype.addEventListener method
 * to ensure that touchmove, touchstart, and touchend events are not passive
 * by default. This allows calling preventDefault() on these events,
 * which is necessary for certain game controls.
 * 
 * The effect runs only once when the component mounts and cleans up when
 * the component unmounts, restoring the original addEventListener method.
 */
export function usePassiveTouchFix() {
  useEffect(() => {
    // Store the original addEventListener method
    const originalAddEventListener: EventTarget['addEventListener'] = EventTarget.prototype.addEventListener;

    // Replace with wrapper that ensures non-passive when options is an object and caller expects non-passive
    // types: listener is EventListenerOrEventListenerObject, options can be boolean or AddEventListenerOptions
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
      // Pass `options` directly (no `any` cast)
      return originalAddEventListener.call(this, type, listener, options);
    };

    // Cleanup function to restore the original addEventListener method
    return () => {
      EventTarget.prototype.addEventListener = originalAddEventListener;
    };
  }, []);
}
