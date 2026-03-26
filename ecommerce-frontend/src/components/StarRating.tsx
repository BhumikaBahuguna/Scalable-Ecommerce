import { Star } from 'lucide-react';

interface Props {
  stars: number;
  count: number;
}

export default function StarRating({ stars, count }: Props) {
  const full = Math.floor(stars);
  const hasHalf = stars - full >= 0.3;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < full ? 'star-filled fill-yellow-400' : (i === full && hasHalf ? 'star-filled fill-yellow-400 opacity-60' : 'star-empty')}
          />
        ))}
      </div>
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        ({count})
      </span>
    </div>
  );
}
