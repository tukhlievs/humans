"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { PersonCard } from "@/components/PersonCard";
import { AddPersonSheet } from "@/components/AddPersonSheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/lib/store";
import { haptic } from "@/lib/telegram";

export default function PeoplePage() {
  const { people, loadingPeople, t } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title={t("people.title")}
        subtitle={t("people.subtitle")}
        action={
          <Button
            size="icon"
            aria-label={t("people.add")}
            onClick={() => { haptic("light"); setOpen(true); }}
          >
            <Plus size={20} />
          </Button>
        }
      />

      {loadingPeople ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[128px] w-full rounded-2xl" />
          ))}
        </div>
      ) : people.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-20 flex flex-col items-center gap-4 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Plus size={26} />
          </div>
          <div>
            <p className="font-semibold text-foreground">{t("people.empty")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("people.add")}
            </p>
          </div>
          <Button onClick={() => { haptic("light"); setOpen(true); }}>
            <Plus size={16} />
            {t("people.add")}
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {people.map((person, index) => (
            <PersonCard key={person.id} person={person} index={index} />
          ))}
        </div>
      )}

      <AddPersonSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
