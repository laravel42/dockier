import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="Dockier home">
      <svg
        width={28}
        height={28}
        viewBox="0 0 32 32"
        className="h-7 w-7"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="dockier-mark-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="7" fill="url(#dockier-mark-gradient)" />
        <path
          d="M10 9h7.5a7 7 0 0 1 0 14H10V9zm4 3.5v7h3.5a3.5 3.5 0 0 0 0-7H14z"
          fill="hsl(var(--primary-foreground))"
        />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">Dockier</span>
    </Link>
  );
}