"use client";

import { motion, type SVGMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface BrandLogoProps extends SVGMotionProps<SVGSVGElement> {
  className?: string;
}

export function BrandLogo({ className, ...props }: BrandLogoProps) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={cn("text-foreground", className)}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 12l10 10 10-10L12 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6l-6 6h12l-6-6z" fill="currentColor" fillOpacity="0.1" />
    </motion.svg>
  );
}
