"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/Avatar";
import type { Person } from "@/types";

export function PersonCard({
  person,
  index = 0,
}: {
  person: Person;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.04,
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        {/* Header row */}
        <div className="flex items-center gap-3">
          <Avatar name={person.name} size={46} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">
              {person.name}
            </p>
            {person.username && (
              <p className="truncate text-sm text-muted-foreground">
                @{person.username}
              </p>
            )}
          </div>
        </div>

        {/* Goal */}
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">
          {person.goal}
        </p>

        {/* Interest tags */}
        {person.interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {person.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
