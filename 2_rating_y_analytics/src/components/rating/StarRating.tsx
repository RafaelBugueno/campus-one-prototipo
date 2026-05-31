import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
  className?: string;
}

export function StarRating({ value, onChange, size = 20, readOnly, className }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} role="radiogroup" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= display;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            aria-label={`${n} estrellas`}
            aria-checked={value === n}
            role="radio"
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(n)}
            className={cn(
              "p-0.5 rounded transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              size={size}
              className={cn(
                "transition-smooth",
                filled ? "fill-gold text-gold" : "fill-transparent text-muted-foreground/40"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
