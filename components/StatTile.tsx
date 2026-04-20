export default function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card rounded-card shadow-card border border-rule p-5">
      <div className="label mb-3">{label}</div>
      <div className="font-serif text-3xl leading-none font-semibold tracking-tight">{value}</div>
      {sub && <div className="font-sans text-xs text-muted mt-2">{sub}</div>}
    </div>
  );
}
