"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  getDemoServerSnapshot,
  getDemoStateSnapshot,
  parseDemoStateSnapshot,
  resetDemoState,
  setDemoRole,
  signInDemoUser,
  signOutDemoUser,
  subscribeDemoState,
  touchActiveDemoSession,
} from "@/lib/demo-store";
import type { DemoRole, DemoState } from "@/lib/types";

type DemoSessionValue = {
  state: DemoState;
  role: DemoRole;
  signedIn: boolean;
  setRole: (role: DemoRole) => void;
  signIn: (role: DemoRole, accountName: string) => void;
  signOut: () => void;
  refresh: () => void;
  reset: () => void;
};

const DemoSessionContext = createContext<DemoSessionValue | null>(null);

export function DemoSessionProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeDemoState, getDemoStateSnapshot, getDemoServerSnapshot);
  const state = useMemo(() => parseDemoStateSnapshot(snapshot), [snapshot]);

  useEffect(() => {
    touchActiveDemoSession();
    const heartbeat = window.setInterval(touchActiveDemoSession, 60_000);
    return () => window.clearInterval(heartbeat);
  }, []);

  const value = useMemo<DemoSessionValue>(
    () => ({
      state,
      role: state.role,
      signedIn: state.signedIn,
      setRole: (role) => {
        setDemoRole(role);
      },
      signIn: (role, accountName) => {
        signInDemoUser(role, accountName);
      },
      signOut: () => {
        signOutDemoUser();
      },
      refresh: () => window.dispatchEvent(new CustomEvent("eventhub-demo-state")),
      reset: () => { resetDemoState(); },
    }),
    [state],
  );

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession() {
  const value = useContext(DemoSessionContext);
  if (!value) throw new Error("useDemoSession must be used inside DemoSessionProvider");
  return value;
}
