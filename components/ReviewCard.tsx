import type { Review } from "@/lib/types";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="border rule bg-white p-5">
      <div className="flex items-baseline justify-between mb-2">
        <div className="font-sans text-sm text-muted">
          {review.author} · {review.semester}
        </div>
        <div className="font-sans text-sm tabular-nums" aria-label={`${review.rating} von 5`}>
          {"★".repeat(review.rating)}
          <span className="text-muted">{"★".repeat(5 - review.rating)}</span>
        </div>
      </div>
      <p className="font-serif leading-snug">{review.text}</p>
    </article>
  );
}
