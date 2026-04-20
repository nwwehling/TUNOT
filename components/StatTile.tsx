export default function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border rule bg-white p-5">
      <div className="label mb-2">{label}</div>
      <div className="font-serif text-3xl leading-none">{value}</div>
      {sub && <div className="font-sans text-xs text-muted mt-2">{sub}</div>}
    </div>
  );
}
