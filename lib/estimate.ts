import type { ChatSender, EstimateDraft, EstimateLine, EstimateRevision, Service } from "@/lib/types";

export function estimateLineTotal(line: EstimateLine) {
  const quantity = Number.isFinite(line.quantity) ? Math.max(0, line.quantity) : 0;
  const unitPrice = Number.isFinite(line.unitPrice) ? Math.max(0, line.unitPrice) : 0;
  return Math.round(quantity * unitPrice);
}

export function estimateTotal(lines: EstimateLine[]) {
  return lines.reduce((total, line) => total + estimateLineTotal(line), 0);
}

export function createEstimateDraft(service: Service): EstimateDraft {
  const guestCount = 50;
  return {
    eventDate: "",
    city: service.city,
    guestCount,
    note: "",
    lines: [
      {
        id: `${service.id}-base`,
        title: service.title,
        quantity: service.priceUnit === "за гостя" ? guestCount : 1,
        unit: service.priceUnit,
        unitPrice: service.priceFrom,
      },
    ],
  };
}

export function estimateRevisionToDraft(revision: EstimateRevision): EstimateDraft {
  return {
    eventDate: revision.eventDate,
    city: revision.city,
    guestCount: revision.guestCount,
    note: revision.note,
    lines: revision.lines.map((line) => ({ ...line })),
  };
}

export function validateEstimateDraft(draft: EstimateDraft) {
  const errors: string[] = [];
  if (!draft.eventDate) errors.push("event_date");
  if (draft.city.trim().length < 2) errors.push("city");
  if (!Number.isInteger(draft.guestCount) || draft.guestCount < 1 || draft.guestCount > 10_000) errors.push("guest_count");
  if (!draft.lines.length) errors.push("lines");
  if (draft.lines.some((line) => line.title.trim().length < 2 || line.unit.trim().length < 1 || !Number.isFinite(line.quantity) || line.quantity <= 0 || !Number.isFinite(line.unitPrice) || line.unitPrice < 0)) errors.push("line_values");
  if (draft.note.length > 1_500) errors.push("note");
  return errors;
}

export function createEstimateRevision(
  draft: EstimateDraft,
  version: number,
  sender: ChatSender,
  createdAt: string,
  id: string,
): EstimateRevision {
  const lines = draft.lines.map((line) => ({
    ...line,
    title: line.title.trim(),
    unit: line.unit.trim(),
    quantity: Number(line.quantity),
    unitPrice: Number(line.unitPrice),
  }));
  return {
    id,
    version,
    sender,
    eventDate: draft.eventDate,
    city: draft.city.trim(),
    guestCount: draft.guestCount,
    note: draft.note.trim(),
    lines,
    total: estimateTotal(lines),
    createdAt,
  };
}
