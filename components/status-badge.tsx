export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const suffix = tone === "neutral" ? "" : ` badge-${tone}`;
  return <span className={`badge${suffix}`}>{children}</span>;
}
