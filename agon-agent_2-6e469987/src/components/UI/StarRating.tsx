import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
  showNumber?: boolean;
}

export default function StarRating({ rating, count, size = 14, showNumber = true }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.min(Math.max(rating - star + 1, 0), 1);
          return (
            <div key={star} className="relative" style={{ width: size, height: size }}>
              <Star className="absolute text-neutral-200" size={size} fill="currentColor" />
              <div
                className="absolute overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className="text-amber-500" size={size} fill="currentColor" />
              </div>
            </div>
          );
        })}
      </div>
      {showNumber && <span className="text-sm text-neutral-600">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="text-sm text-neutral-400">({count})</span>}
    </div>
  );
}
