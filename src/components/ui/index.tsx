import { forwardRef, type InputHTMLAttributes } from "react";
import { RiStarFill, RiStarHalfFill, RiStarLine } from "react-icons/ri";
import { cn } from "../../utils/utils";

// ── Badge ──────────────────────────────────────────────────
interface BadgeProps {
  variant?: "accent" | "success" | "danger" | "warning" | "muted" | "price";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = "muted",
  size = "md",
  className,
  children,
}: BadgeProps) {
  const variants = {
    accent:
      "bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/20",
    success: "bg-emerald-950/50 text-emerald-400 border border-emerald-500/20",
    danger: "bg-red-950/50 text-red-400 border border-red-500/20",
    warning: "bg-amber-950/50 text-amber-400 border border-amber-500/20",
    muted:
      "bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)]",
    price:
      "bg-[#ffd54f]/10 text-[var(--color-price)] border border-[var(--color-price)]/20",
  };
  const sizes = { sm: "px-1.5 py-0.5 text-[11px]", md: "px-2.5 py-1 text-xs" };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-md",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ── Input ──────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-(--color-text-secondary)">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-(--color-bg-card) border border-(--color-border) rounded-lg",
            "text-(--color-text-primary) placeholder:text-(--color-text-muted)",
            "focus:outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-accent)/30",
            "transition-all duration-200 text-sm",
            "py-2.5",
            leftIcon ? "pl-10 pr-3" : "px-3",
            rightIcon ? "pr-10" : "",
            error &&
              "border-(--color-danger) focus:border-(--color-danger)",
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-(--color-danger)">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";

// ── Skeleton ───────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="card-base p-4 space-y-3">
      <Skeleton className="w-full aspect-square rounded-lg" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center pt-1">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}

// ── StarRating ─────────────────────────────────────────────
export function StarRating({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return filled ? (
          <RiStarFill
            key={star}
            size={size}
            className="text-(--color-price)"
          />
        ) : half ? (
          <RiStarHalfFill
            key={star}
            size={size}
            className="text-(--color-price)"
          />
        ) : (
          <RiStarLine
            key={star}
            size={size}
            className="text-(--color-text-muted)"
          />
        );
      })}
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px bg-(--color-border)", className)} />;
}

// ── Spinner ────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="animate-spin text-(--color-accent)"
      style={{ width: size, height: size }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
