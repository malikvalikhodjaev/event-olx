export type DemoRole =
  | "client"
  | "client_planner"
  | "supplier"
  | "supplier_planner"
  | "admin";

export type PriceUnit = "за услугу" | "за час" | "за гостя" | "за день";

export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  requiredForWedding: boolean;
};

export type Supplier = {
  id: string;
  slug: string;
  name: string;
  city: string;
  description: string;
  verified: boolean;
  verificationLabel: string;
  updatedAt: string;
  responseMedianMinutes: number | null;
  responseSampleSize: number;
  portfolio: string[];
};

export type Service = {
  id: string;
  supplierId: string;
  categoryId: string;
  title: string;
  description: string;
  city: string;
  priceFrom: number;
  priceUnit: PriceUnit;
  active: boolean;
  published: boolean;
  updatedAt: string;
  availabilityConfirmedAt: string | null;
};

export type RequestStatus =
  | "submitted"
  | "viewed"
  | "accepted_for_discussion"
  | "declined"
  | "closed";

export type DemoRequest = {
  id: string;
  clientName: string;
  clientPhone: string;
  supplierId: string;
  serviceId: string;
  eventType: string;
  eventDate: string;
  city: string;
  guestCount: number;
  budget: number;
  message: string;
  status: RequestStatus;
  createdAt: string;
  firstViewedAt: string | null;
  firstRespondedAt: string | null;
};

export type PlannerItem = {
  categoryId: string;
  selectedServiceId: string | null;
  budget: number;
  done: boolean;
};

export type ModerationStatus = "pending" | "approved" | "changes_requested" | "hidden";

export type ModerationItem = {
  id: string;
  serviceId: string;
  supplierId: string;
  reason: string;
  status: ModerationStatus;
  updatedAt: string;
};

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  reason: string;
  createdAt: string;
};

export type DemoState = {
  role: DemoRole;
  shortlist: string[];
  plannerItems: PlannerItem[];
  requests: DemoRequest[];
  importedServices: Service[];
  moderation: ModerationItem[];
  audit: AuditEntry[];
  bannedSupplierIds: string[];
};

export type ImportServiceRow = {
  rowNumber: number;
  externalId: string;
  title: string;
  category: string;
  city: string;
  description: string;
  priceFrom: number | null;
  priceUnit: string;
  availability: string;
  errors: string[];
};
