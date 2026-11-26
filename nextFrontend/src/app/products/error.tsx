"use client";

export default function ProductsError({ retry }: { retry: () => void }) {
  return (
    <div role="alert" className="py-12 text-center">
      <p className="mb-3">Could not load products. Is the API running?</p>
      <button
        type="button"
        onClick={() => retry()}
        className="cursor-pointer underline"
      >
        Try again
      </button>
    </div>
  );
}
