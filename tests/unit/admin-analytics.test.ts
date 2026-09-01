import { describe, expect, it } from "vitest";
import { calculateAdminAnalytics } from "@/lib/admin-analytics";
import { seededConversations, seededModeration, services, suppliers } from "@/lib/demo-data";
import type { UserSession } from "@/lib/types";

const sessions: UserSession[] = [
  {
    id: "session-admin",
    accountKey: "admin@marosim.local",
    role: "admin",
    signedInAt: "2026-09-02T11:30:00+05:00",
    lastSeenAt: "2026-09-02T11:55:00+05:00",
    signedOutAt: null,
  },
  {
    id: "session-client-1",
    accountKey: "client@marosim.local",
    role: "client",
    signedInAt: "2026-09-01T10:00:00+05:00",
    lastSeenAt: "2026-09-01T10:25:00+05:00",
    signedOutAt: "2026-09-01T10:25:00+05:00",
  },
  {
    id: "session-client-2",
    accountKey: "client@marosim.local",
    role: "client",
    signedInAt: "2026-08-31T18:00:00+05:00",
    lastSeenAt: "2026-08-31T18:15:00+05:00",
    signedOutAt: "2026-08-31T18:15:00+05:00",
  },
];

describe("admin analytics", () => {
  it("считает уникальных пользователей, онлайн и показатели ответа за период", () => {
    const conversations = [
      { ...seededConversations[0], firstSupplierResponseAt: "2026-09-01T19:20:00+05:00" },
    ];
    const result = calculateAdminAnalytics({
      period: "30d",
      now: new Date("2026-09-02T12:00:00+05:00"),
      suppliers,
      services,
      conversations,
      moderation: seededModeration,
      bannedSupplierIds: [],
      userSessions: sessions,
    });

    expect(result.suppliersTotal).toBe(6);
    expect(result.suppliersNew).toBe(4);
    expect(result.activeUsers).toBe(2);
    expect(result.onlineUsers).toBe(1);
    expect(result.conversations).toBe(1);
    expect(result.responseRate).toBe(100);
    expect(result.medianResponseMinutes).toBe(60);
    expect(result.pendingModeration).toBe(1);
    expect(result.activity.reduce((sum, bucket) => sum + bucket.conversations, 0)).toBe(1);
  });

  it("не показывает выдуманный процент ответа, если диалогов нет", () => {
    const result = calculateAdminAnalytics({
      period: "7d",
      now: new Date("2026-10-02T12:00:00+05:00"),
      suppliers,
      services,
      conversations: seededConversations,
      moderation: seededModeration,
      bannedSupplierIds: ["supplier-sabo-decor"],
      userSessions: sessions,
    });

    expect(result.conversations).toBe(0);
    expect(result.responseRate).toBeNull();
    expect(result.medianResponseMinutes).toBeNull();
    expect(result.bannedSuppliers).toBe(1);
  });
});
