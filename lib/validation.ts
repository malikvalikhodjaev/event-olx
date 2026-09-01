import { z } from "zod";

export const requestSchema = z.object({
  clientName: z.string().trim().min(2, "Укажите имя"),
  clientPhone: z.string().trim().regex(/^\+?[0-9 ()-]{9,20}$/, "Проверьте номер телефона"),
  serviceId: z.string().min(1, "Выберите предложение"),
  eventType: z.string().trim().min(2, "Укажите тип мероприятия"),
  eventDate: z.string().min(1, "Укажите дату"),
  city: z.string().trim().min(2, "Укажите город"),
  guestCount: z.coerce.number().int().min(1, "Количество гостей должно быть больше нуля").max(10_000),
  budget: z.coerce.number().min(0, "Бюджет не может быть отрицательным"),
  message: z.string().trim().min(10, "Добавьте минимум 10 символов контекста").max(1_500),
});

export type RequestInput = z.infer<typeof requestSchema>;
