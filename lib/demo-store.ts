"use client";

import { categories, seededModeration, seededRequests } from "@/lib/demo-data";
import type { AuditEntry, DemoRequest, DemoRole, DemoState, ModerationStatus, Service } from "@/lib/types";

const STORAGE_KEY = "eventhub-uz-demo-v1";

export function createInitialDemoState(): DemoState {
  return {
    role: "client",
    shortlist: [],
    plannerItems: categories
      .filter((category) => category.requiredForWedding)
      .map((category) => ({ categoryId: category.id, selectedServiceId: null, budget: 0, done: false })),
    requests: seededRequests,
    importedServices: [],
    moderation: seededModeration,
    audit: [],
    bannedSupplierIds: [],
  };
}

export function loadDemoState(): DemoState {
  if (typeof window === "undefined") return createInitialDemoState();
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return createInitialDemoState();
  try {
    return { ...createInitialDemoState(), ...(JSON.parse(stored) as Partial<DemoState>) };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return createInitialDemoState();
  }
}

const INITIAL_SNAPSHOT = JSON.stringify(createInitialDemoState());

export function getDemoStateSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? INITIAL_SNAPSHOT;
}

export function getDemoServerSnapshot() {
  return INITIAL_SNAPSHOT;
}

export function parseDemoStateSnapshot(snapshot: string): DemoState {
  try {
    return { ...createInitialDemoState(), ...(JSON.parse(snapshot) as Partial<DemoState>) };
  } catch {
    return createInitialDemoState();
  }
}

export function subscribeDemoState(onStoreChange: () => void) {
  window.addEventListener("eventhub-demo-state", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("eventhub-demo-state", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function saveDemoState(state: DemoState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("eventhub-demo-state", { detail: state }));
}

export function setDemoRole(role: DemoRole) {
  const state = loadDemoState();
  saveDemoState({ ...state, role });
}

export function addToShortlist(serviceId: string) {
  const state = loadDemoState();
  const shortlist = state.shortlist.includes(serviceId)
    ? state.shortlist.filter((id) => id !== serviceId)
    : [...state.shortlist, serviceId];
  saveDemoState({ ...state, shortlist });
  return shortlist;
}

export function addDemoRequest(request: DemoRequest) {
  const state = loadDemoState();
  saveDemoState({ ...state, requests: [request, ...state.requests] });
}

export function updateDemoRequest(requestId: string, patch: Partial<DemoRequest>) {
  const state = loadDemoState();
  saveDemoState({
    ...state,
    requests: state.requests.map((request) => (request.id === requestId ? { ...request, ...patch } : request)),
  });
}

export function addImportedServices(newServices: Service[]) {
  const state = loadDemoState();
  saveDemoState({ ...state, importedServices: [...newServices, ...state.importedServices] });
}

export function updateModeration(itemId: string, status: ModerationStatus, reason: string) {
  const state = loadDemoState();
  const auditEntry: AuditEntry = {
    id: crypto.randomUUID(),
    actor: "admin@marosim.local",
    action: status,
    target: itemId,
    reason,
    createdAt: new Date().toISOString(),
  };
  saveDemoState({
    ...state,
    moderation: state.moderation.map((item) =>
      item.id === itemId ? { ...item, status, reason, updatedAt: auditEntry.createdAt } : item,
    ),
    audit: [auditEntry, ...state.audit],
  });
}

export function setSupplierBanned(supplierId: string, banned: boolean, reason: string) {
  const state = loadDemoState();
  const bannedSupplierIds = banned
    ? Array.from(new Set([...state.bannedSupplierIds, supplierId]))
    : state.bannedSupplierIds.filter((id) => id !== supplierId);
  const auditEntry: AuditEntry = {
    id: crypto.randomUUID(),
    actor: "admin@marosim.local",
    action: banned ? "supplier_banned" : "supplier_unbanned",
    target: supplierId,
    reason,
    createdAt: new Date().toISOString(),
  };
  saveDemoState({ ...state, bannedSupplierIds, audit: [auditEntry, ...state.audit] });
}

export function resetDemoState() {
  const state = createInitialDemoState();
  saveDemoState(state);
  return state;
}
