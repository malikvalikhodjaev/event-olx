import type { DemoRequest, ModerationItem, Service, Supplier, UserSession } from "@/lib/types";

export type DashboardPeriod = "7d" | "30d" | "90d" | "all";

export type ActivityBucket = {
  key: string;
  label: string;
  requests: number;
  users: number;
};

export type AdminAnalytics = {
  periodLabel: string;
  suppliersTotal: number;
  suppliersNew: number;
  activeUsers: number;
  onlineUsers: number;
  requests: number;
  responseRate: number | null;
  respondedRequests: number;
  medianResponseMinutes: number | null;
  publishedServices: number;
  verifiedSuppliers: number;
  pendingModeration: number;
  bannedSuppliers: number;
  previous: {
    activeUsers: number | null;
    requests: number | null;
  };
  activity: ActivityBucket[];
};

type AdminAnalyticsInput = {
  period: DashboardPeriod;
  now: Date;
  suppliers: Supplier[];
  services: Service[];
  requests: DemoRequest[];
  moderation: ModerationItem[];
  bannedSupplierIds: string[];
  userSessions: UserSession[];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const PERIOD_DAYS: Record<Exclude<DashboardPeriod, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

function asTime(value: string) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

function isWithin(value: string, start: number, end: number) {
  const time = asTime(value);
  return time >= start && time < end;
}

function uniqueAccounts(sessions: UserSession[]) {
  return new Set(sessions.map((session) => session.accountKey)).size;
}

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[middle];
  return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

function startOfDay(time: number) {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function resolvePeriodStart(input: AdminAnalyticsInput, end: number) {
  if (input.period !== "all") {
    return startOfDay(end) - (PERIOD_DAYS[input.period] - 1) * DAY_MS;
  }

  const timestamps = [
    ...input.suppliers.map((supplier) => asTime(supplier.createdAt)),
    ...input.requests.map((request) => asTime(request.createdAt)),
    ...input.userSessions.map((session) => asTime(session.signedInAt)),
  ].filter((time) => time > 0 && time <= end);
  return timestamps.length ? startOfDay(Math.min(...timestamps)) : startOfDay(end);
}

function activityBuckets(
  start: number,
  end: number,
  requests: DemoRequest[],
  sessions: UserSession[],
) {
  const durationDays = Math.max(1, Math.ceil((end - start) / DAY_MS));
  const bucketCount = Math.min(durationDays, durationDays <= 14 ? 14 : durationDays <= 45 ? 10 : 9);
  const bucketDuration = (end - start) / bucketCount;

  return Array.from({ length: bucketCount }, (_, index): ActivityBucket => {
    const bucketStart = start + index * bucketDuration;
    const bucketEnd = index === bucketCount - 1 ? end : start + (index + 1) * bucketDuration;
    const label = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" })
      .format(new Date(bucketStart))
      .replace(".", "");
    return {
      key: `${Math.round(bucketStart)}-${Math.round(bucketEnd)}`,
      label,
      requests: requests.filter((request) => isWithin(request.createdAt, bucketStart, bucketEnd)).length,
      users: uniqueAccounts(sessions.filter((session) => isWithin(session.signedInAt, bucketStart, bucketEnd))),
    };
  });
}

export function calculateAdminAnalytics(input: AdminAnalyticsInput): AdminAnalytics {
  const end = input.now.getTime() + 1;
  const start = resolvePeriodStart(input, end);
  const duration = end - start;
  const previousStart = start - duration;
  const periodSessions = input.userSessions.filter((session) => isWithin(session.signedInAt, start, end));
  const periodRequests = input.requests.filter((request) => isWithin(request.createdAt, start, end));
  const respondedRequests = periodRequests.filter((request) => request.firstRespondedAt);
  const responseMinutes = respondedRequests.map((request) =>
    Math.max(0, Math.round((asTime(request.firstRespondedAt ?? request.createdAt) - asTime(request.createdAt)) / 60_000)),
  );
  const onlineThreshold = input.now.getTime() - 15 * 60_000;
  const onlineUsers = uniqueAccounts(
    input.userSessions.filter(
      (session) => !session.signedOutAt && asTime(session.lastSeenAt) >= onlineThreshold,
    ),
  );
  const previousSessions = input.period === "all"
    ? []
    : input.userSessions.filter((session) => isWithin(session.signedInAt, previousStart, start));
  const previousRequests = input.period === "all"
    ? []
    : input.requests.filter((request) => isWithin(request.createdAt, previousStart, start));

  return {
    periodLabel: input.period === "all" ? "За всё время" : `Последние ${PERIOD_DAYS[input.period]} дней`,
    suppliersTotal: input.suppliers.length,
    suppliersNew: input.suppliers.filter((supplier) => isWithin(supplier.createdAt, start, end)).length,
    activeUsers: uniqueAccounts(periodSessions),
    onlineUsers,
    requests: periodRequests.length,
    responseRate: periodRequests.length ? Math.round((respondedRequests.length / periodRequests.length) * 100) : null,
    respondedRequests: respondedRequests.length,
    medianResponseMinutes: median(responseMinutes),
    publishedServices: input.services.filter(
      (service) => service.published && service.active && !input.bannedSupplierIds.includes(service.supplierId),
    ).length,
    verifiedSuppliers: input.suppliers.filter(
      (supplier) => supplier.verified && !input.bannedSupplierIds.includes(supplier.id),
    ).length,
    pendingModeration: input.moderation.filter((item) => item.status === "pending").length,
    bannedSuppliers: input.bannedSupplierIds.length,
    previous: {
      activeUsers: input.period === "all" ? null : uniqueAccounts(previousSessions),
      requests: input.period === "all" ? null : previousRequests.length,
    },
    activity: activityBuckets(start, end, periodRequests, periodSessions),
  };
}
