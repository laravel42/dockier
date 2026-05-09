import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "./dashboard-mockup";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.14_180/15%),transparent_60%)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            New: AI architecture analysis on every commit
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-gradient sm:text-6xl lg:text-7xl"
          >
            AI-native DevSecOps for{" "}
            <span className="text-gradient-primary whitespace-nowrap text-3xl sm:text-5xl lg:text-6xl">modern engineering teams</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            Connect your repositories, scan for vulnerabilities, understand your architecture
            with AI, and ship to production — all from one platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild size="lg" className="glow">
              <Link to="/contact">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Book demo</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="https://github.com/dockier" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" /> View on GitHub
              </a>
            </Button>
          </motion.div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card · Self-hostable · Free for OSS
          </p>
        </div>
        <div className="mt-16 lg:mt-20">
          <DashboardMockup />
        </div>
      </div>
    </div>
  );
}