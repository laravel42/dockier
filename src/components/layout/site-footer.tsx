import { Link } from "@tanstack/react-router";
import { Github, Twitter } from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { site } from "@/lib/site";

const cols: ReadonlyArray<{ title: string; links: ReadonlyArray<{ label: string; to: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Product tour", to: "/product" },
      { label: "Pricing", to: "/pricing" },
      { label: "Compare", to: "/compare" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", to: "/docs" },
      { label: "Changelog", to: "/changelog" },
      { label: "Blog", to: "/blog" },
      { label: "Security", to: "/security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "Book demo", to: "/contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            AI-native DevSecOps for modern engineering teams. Secure. Analyze. Deploy.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href={site.github} aria-label="GitHub" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold">{c.title}</h3>
            <ul className="mt-4 space-y-2">
              {c.links.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Dockier Labs. All rights reserved.</p>
          <p>Built for engineering teams who ship.</p>
        </div>
      </div>
    </footer>
  );
}