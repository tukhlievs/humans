"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/store";
import { haptic } from "@/lib/telegram";

export function AddPersonSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addPerson, t } = useApp();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [interests, setInterests] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  const reset = () => {
    setName("");
    setGoal("");
    setInterests("");
    setError(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !goal.trim() || pending) return;

    setPending(true);
    setError(false);
    const ok = await addPerson({
      name: name.trim(),
      goal: goal.trim(),
      interests: interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setPending(false);

    if (!ok) {
      setError(true);
      return;
    }
    haptic("medium");
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-2xl border-t border-border bg-surface p-5 pb-[calc(env(safe-area-inset-bottom)+20px)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-surface-2" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("form.title")}</h2>
              <button
                onClick={onClose}
                aria-label={t("form.cancel")}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm text-muted">{t("form.name")}</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-muted">{t("form.goal")}</label>
                <Textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder={t("form.goal.ph")}
                  maxLength={160}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-muted">{t("form.interests")}</label>
                <Input
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder={t("form.interests.ph")}
                />
              </div>

              {error ? <p className="text-sm text-red-400">{t("form.error")}</p> : null}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                  {t("form.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!name.trim() || !goal.trim() || pending}
                >
                  {pending ? t("form.saving") : t("form.save")}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
