// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/admin/stat-card.tsx
// One number on the admin dashboard, e.g. "Products 12"
// ─────────────────────────────────────────────────────────────────────────────

// White box style.
import { cardClass } from '@/components/ui/styles';

// label = what is counted; value = the number.
export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className={cardClass}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
