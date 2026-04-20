import type { Review } from "@/lib/types";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="bg-card rounded-card shadow-card border border-rule p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-sans text-xs text-muted">
          {review.author} · {review.semester}
        </div>
        <div className="font-sans text-sm tracking-tight" aria-label={`${review.rating} von 5`}>
          <span className="text-tu-greenDark">{"★".repeat(review.rating)}</span>
          <span className="text-rule">{"★".repeat(5 - review.rating)}</span>
        </div>
      </div>
      <p className="font-serif text-[0.95rem] leading-relaxed text-ink/90">{review.text}</p>
    </article>
  );
}
