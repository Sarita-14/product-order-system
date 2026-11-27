// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/admin/users-table.tsx
// Admin list of registered users, with a "Make admin" / "Make customer" button per row.
// The logged-in admin's own row has no button (nobody may change their own role).
// DATA COMES FROM: the `users` prop (the admin users page fetched them) + `currentUserId`.
// ─────────────────────────────────────────────────────────────────────────────

// The Server Action that changes a role.
import { changeUserRole } from '@/actions/user.actions';
// The shared form (button + green/red message).
import { ActionForm } from '@/components/ui/action-form';
// Shared table styles.
import { mutedClass, tableClass, tdClass, thClass } from '@/components/ui/styles';
// Date -> nice text.
import { formatDate } from '@/lib/format';
// The User shape.
import type { User } from '@/types/user';

// currentUserId = the admin looking at the page (their row gets "You" instead of a button).
export function UsersTable({ users, currentUserId }: { users: User[]; currentUserId: string }) {
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
            <th className={thClass}>Action</th>
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
              <td className={tdClass}>
                <RoleButton user={user} isYou={user.id === currentUserId} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// One row's button: customer -> "Make admin"; admin -> "Make customer"; yourself -> "You".
function RoleButton({ user, isYou }: { user: User; isYou: boolean }) {
  if (isYou) return <span className={mutedClass}>You</span>;
  // The role this button switches to.
  const next = user.role === 'admin' ? 'customer' : 'admin';
  return (
    // .bind(null, user.id, next) = the action already knows WHO and WHICH role
    <ActionForm
      action={changeUserRole.bind(null, user.id, next)}
      submitLabel={next === 'admin' ? 'Make admin' : 'Make customer'}
      pendingLabel="Saving…"
      // Taking admin rights away is the "careful" action -> red; giving them -> outlined
      variant={next === 'admin' ? 'secondary' : 'danger'}
      className="flex flex-col gap-2"
    />
  );
}
