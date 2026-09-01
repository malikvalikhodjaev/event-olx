import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) throw new Error("Задайте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
const password = "EventHub-Demo-2026!";
const accounts = [
  ["client@eventhub.local", "Клиент", "client"],
  ["planner@eventhub.local", "Планировщик клиента", "client_planner"],
  ["supplier@eventhub.local", "Поставщик", "supplier"],
  ["supplier-planner@eventhub.local", "Планировщик поставщика", "supplier_planner"],
  ["admin@eventhub.local", "Администратор", "admin"],
];

const ids = new Map();
for (const [email, fullName, role] of accounts) {
  const { data: existing } = await supabase.auth.admin.listUsers();
  let user = existing.users.find((item) => item.email === email);
  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: fullName } });
    if (error) throw error;
    user = data.user;
  }
  ids.set(email, user.id);
  const { error: profileError } = await supabase.from("profiles").upsert({ id: user.id, full_name: fullName });
  if (profileError) throw profileError;
  const { error: roleDeleteError } = await supabase.from("profile_roles").delete().eq("profile_id", user.id);
  if (roleDeleteError) throw roleDeleteError;
  const { error: roleError } = await supabase.from("profile_roles").insert({ profile_id: user.id, role });
  if (roleError) throw roleError;
}

const supplierId = "20000000-0000-0000-0000-000000000001";
const { error: supplierError } = await supabase.from("supplier_profiles").upsert({ id: supplierId, owner_id: ids.get("supplier@eventhub.local"), name: "Silk Road Events", slug: "silk-road-events", city: "Ташкент", description: "Банкетная площадка и координация мероприятий.", status: "active", verified_at: new Date().toISOString() });
if (supplierError) throw supplierError;
const { error: memberError } = await supabase.from("supplier_members").upsert([
  { supplier_id: supplierId, profile_id: ids.get("supplier@eventhub.local"), role: "supplier" },
  { supplier_id: supplierId, profile_id: ids.get("supplier-planner@eventhub.local"), role: "supplier_planner" },
]);
if (memberError) throw memberError;

console.log(`Готово: ${accounts.length} демо-пользователей и поставщик Silk Road Events.`);
