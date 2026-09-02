export type DemoRole =
  | "client"
  | "client_planner"
  | "supplier"
  | "supplier_planner"
  | "admin";

export type CatalogSection = "services" | "market" | "equipment";

export type OfferKind = "service" | "sale" | "rental";

export type PriceUnit =
  | "за услугу"
  | "за час"
  | "за гостя"
  | "за день"
  | "за штуку"
  | "за набор"
  | "за комплект"
  | "за килограмм";

export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  section: CatalogSection;
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
  createdAt: string;
};

export type Service = {
  id: string;
  sku: string;
  supplierId: string;
  categoryId: string;
  title: string;
  description: string;
  city: string;
  priceFrom: number;
  priceUnit: PriceUnit;
  offerKind: OfferKind;
  imageUrl: string;
  active: boolean;
  published: boolean;
  updatedAt: string;
  availabilityConfirmedAt: string | null;
};

export type ChatSender = "client" | "supplier";

export type ChatMessage = {
  id: string;
  sender: ChatSender;
  text: string;
  createdAt: string;
  readAt: string | null;
};

export type Conversation = {
  id: string;
  clientAccount: string;
  clientName: string;
  supplierId: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  firstSupplierResponseAt: string | null;
  messages: ChatMessage[];
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

export type UserSession = {
  id: string;
  accountKey: string;
  role: DemoRole;
  signedInAt: string;
  lastSeenAt: string;
  signedOutAt: string | null;
};

export type DemoState = {
  role: DemoRole;
  signedIn: boolean;
  accountName: string;
  shortlist: string[];
  plannerItems: PlannerItem[];
  conversations: Conversation[];
  importedServices: Service[];
  moderation: ModerationItem[];
  audit: AuditEntry[];
  bannedSupplierIds: string[];
  userSessions: UserSession[];
  activeSessionId: string | null;
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
  offerKind: string;
  availability: string;
  errors: string[];
};
