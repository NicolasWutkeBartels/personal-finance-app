"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { BrandLogo } from "@/components/brand-logo";

type LaunchContextType = {
  showSplash: boolean;
  layoutIdEnabled: boolean;
};

const LaunchContext = React.createContext<LaunchContextType>({
  showSplash: true,
  layoutIdEnabled: true,
});

export const useLaunch = () => React.useContext(LaunchContext);

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export function LaunchProvider({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = React.useState(true);
  const [layoutIdEnabled, setLayoutIdEnabled] = React.useState(true);
  const [isInitialMount, setIsInitialMount] = React.useState(true);
  const lastActiveRef = React.useRef(0);

  // Manage splash screen phase duration
  React.useEffect(() => {
    if (showSplash) {
      // Force overflow hidden on body while splash is running
      document.body.style.overflow = "hidden";

      // Phase 1 (Entry) + Phase 2 (Pause) = 750ms total centering time
      const timer = setTimeout(() => {
        setShowSplash(false);
        setIsInitialMount(false);

        // Phase 3 (Exit): Disable layoutId bindings 600ms after transition starts
        // to prevent route navigation changes from triggering transitions later.
        setTimeout(() => {
          setLayoutIdEnabled(false);
        }, 600);
      }, 750);

      return () => {
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [showSplash]);

  // Track user activity to trigger splash on return after long inactivity
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize the last active ref inside useEffect to keep render pure
    lastActiveRef.current = Date.now();

    const handleActivity = () => {
      lastActiveRef.current = Date.now();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const inactiveDuration = Date.now() - lastActiveRef.current;
        if (inactiveDuration > INACTIVITY_TIMEOUT) {
          // Setting layoutIdEnabled and showSplash in an event handler is correct and safe
          setLayoutIdEnabled(true);
          setShowSplash(true);
        } else {
          lastActiveRef.current = Date.now();
        }
      }
    };

    // Standard user interactions
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <LaunchContext.Provider value={{ showSplash, layoutIdEnabled }}>
      {/* Main App Content Reveal Layout */}
      <motion.div
        animate={{
          opacity: showSplash ? 0 : 1,
          y: showSplash ? 8 : 0,
          filter: showSplash ? "blur(4px)" : "blur(0px)",
        }}
        transition={{
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
          delay: showSplash ? 0 : 0.1,
        }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>

      {/* Full screen Splash overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background select-none pointer-events-none"
          >
            <motion.div
              initial={
                isInitialMount
                  ? { opacity: 0, scale: 0.92, filter: "blur(8px)" }
                  : false
              }
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 text-center pointer-events-auto"
            >
              <BrandLogo
                layoutId={layoutIdEnabled ? "brand-logo-svg" : undefined}
                className="h-16 w-16 text-foreground"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                layoutId={layoutIdEnabled ? "brand-logo-text" : undefined}
                className="font-bold tracking-widest text-foreground text-2xl uppercase font-sans mt-2"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                FINANCE
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LaunchContext.Provider>
  );
}
