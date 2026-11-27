
import Link from 'next/link';
// The Server Action that sends the review.
import { createReview } from '@/actions/review.actions';
// The shared form (button + green/red message).
import { ActionForm } from '@/components/ui/action-form';
// Shared styles.
import { inputClass, labelClass, linkClass, mutedClass } from '@/components/ui/styles';
// Who is looking (or null for visitors).
import { getCurrentUser } from '@/lib/auth';
// URL helpers.
import { loginPath, productPath } from '@/lib/routes';
// The rules (limits for the inputs).
import { MAX_COMMENT_LENGTH, MAX_RATING, MIN_RATING } from '@/types/review';

// The star choices, highest first: [5, 4, 3, 2, 1].
// Array.from({ length: 5 }, (_, i) => 5 - i) = build a list of 5 by counting down.
const RATING_CHOICES = Array.from({ length: MAX_RATING - MIN_RATING + 1 }, (_, i) => MAX_RATING - i);

export async function ReviewForm({ productId }: { productId: string }) {
  const user = await getCurrentUser();

  // Admin -> nothing to show.
  if (user?.role === 'admin') return null;

  // Visitor -> log in first (and come back to this product afterwards).
  if (!user) {
    return (
      <p className={`text-sm ${mutedClass}`}>
        <Link href={loginPath(productPath(productId))} className={linkClass}>
          Login
        </Link>{' '}
        to write a review.
      </p>
    );
  }

  // Customer -> the form. Whether they may review (delivered order) is decided by the backend;
  // if not, its message appears in the red box.
  return (
    <ActionForm
      action={createReview.bind(null, productId)} // the action already knows WHICH product
      submitLabel="Submit review"
      pendingLabel="Submitting…"
    >
      <h3 className="font-semibold text-slate-900">Write a review</h3>
      <label className={labelClass}>
        Rating
        {/* A drop-down; its value ("5") is what the action reads as "rating" */}
        <select name="rating" required defaultValue={MAX_RATING} className={inputClass}>
          {RATING_CHOICES.map((stars) => (
            // key = React's id for each item of a list
            <option key={stars} value={stars}>
              {'★'.repeat(stars)} ({stars})
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Comment
        <textarea
          name="comment"
          required // the browser refuses an empty box
          maxLength={MAX_COMMENT_LENGTH} // the browser stops typing after 1000 characters
          rows={4} // 4 lines tall
          placeholder="What did you like or dislike?"
          className={`${inputClass} h-auto py-2`}
        />
      </label>
    </ActionForm>
  );
}
