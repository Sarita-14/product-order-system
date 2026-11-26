// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/admin/users-table.tsx
// Admin list of registered users.
// DATA COMES FROM: the `users` prop (the admin users page fetched them).
// ─────────────────────────────────────────────────────────────────────────────

// Shared table styles.
import { tableClass, tdClass, thClass } from '@/components/ui/styles';
// Date -> nice text.
import { formatDate } from '@/lib/format';
// The User shape.
import type { User } from '@/types/user';

export function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className={tableClass}>
        <thead>
          <tr>
            <th className={thClass}>Username</th>
            <th className={thClass}>Email</th>
            <th className={thClass}>Phone</th>
            <th className={thClass}>Role</th>
            <th className={thClass}>Joined</th>
          </tr>
        </thead>
        <tbody>
          {/* One row per user */}
          {users.map((user) => (
            <tr key={user.id}>
              <td className={tdClass}>{user.username}</td>
              <td className={tdClass}>{user.email}</td>
              <td className={tdClass}>{user.phoneNumber}</td>
              {/* capitalize = "customer" shows as "Customer" */}
              <td className={`${tdClass} capitalize`}>{user.role}</td>
              <td className={tdClass}>{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
