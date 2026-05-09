import { Link } from "@tanstack/react-router";
import logo from "@/assets/dockier-mark.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="Dockier home">
      <img src={logo} alt="" width={28} height={28} className="h-7 w-7" />
      <span className="font-display text-xl font-semibold tracking-tight">Dockier</span>
    </Link>
  );
}