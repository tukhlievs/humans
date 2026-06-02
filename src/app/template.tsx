"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Next.js App Router re-creates template.tsx on every navigation,
 * which makes it the correct place for Framer Motion page transitions.
 * (layout.tsx persists across routes and cannot drive AnimatePresence.)
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
