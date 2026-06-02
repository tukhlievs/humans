"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/Avatar";
import type { Person } from "@/types";

export function PersonCard({ person, index = 0 }: { person: Person; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: "easeOut" }}
    >
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Avatar name={person.name} size={46} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{person.name}</h3>
            {person.username ? (
              <p className="truncate text-sm text-muted">@{person.username}</p>
            ) : null}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{person.goal}</p>
        {person.interests.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {person.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted"
              >
                {interest}
              </span>
            ))}
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}
