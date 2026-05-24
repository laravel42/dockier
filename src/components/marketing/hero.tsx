import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.14_180/15%),transparent_60%)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-gradient sm:text-6xl lg:text-7xl"
          >
            AI-native DevSecOps for{" "}
            <span className="text-gradient-primary whitespace-nowrap text-[2.25rem] sm:text-[3.5rem] lg:text-[4rem]">modern engineering teams</span>
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
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" className="glow h-14 px-8 text-lg" asChild>
              <a href="#early-access">
                Get early access <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}