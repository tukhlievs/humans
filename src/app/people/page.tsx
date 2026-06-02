"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PersonCard } from "@/components/PersonCard";
import { AddPersonSheet } from "@/components/AddPersonSheet";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { haptic } from "@/lib/telegram";

export default function PeoplePage() {
  const { people, t } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("people.title")}
        subtitle={t("people.subtitle")}
        action={
          <Button
            size="icon"
            aria-label={t("people.add")}
            onClick={() => {
              haptic("light");
              setOpen(true);
            }}
          >
            <Plus size={20} />
          </Button>
        }
      />

      {people.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted">{t("people.empty")}</p>
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
