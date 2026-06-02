"use client";

import { useState, type FormEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";
import { haptic } from "@/lib/telegram";

export function AddPersonSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addPerson, t } = useApp();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [interests, setInterests] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  const dragY = useMotionValue(0);
  const opacity = useTransform(dragY, [0, 200], [1, 0.4]);
  const scale  = useTransform(dragY, [0, 200], [1, 0.96]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 90 || info.velocity.y > 350) {
      onClose();
    } else {
      dragY.set(0);
    }
  };

  const reset = () => {
    setName(""); setGoal(""); setInterests(""); setError(false);
    dragY.set(0);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !goal.trim() || pending) return;
    setPending(true);
    setError(false);
    const ok = await addPerson({
      name: name.trim(),
      goal: goal.trim(),
      interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setPending(false);
    if (!ok) { setError(true); return; }
    haptic("medium");
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md"
            style={{ y: dragY, opacity, scale }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340, mass: 0.9 }}
          >
            <div className="rounded-t-3xl border-t border-x border-border bg-card px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+20px)]">
              {/* Drag handle */}
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />

              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">{t("form.title")}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                  onClick={onClose}
                  aria-label={t("form.cancel")}
                >
                  <X size={16} />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="person-name">{t("form.name")}</Label>
                  <Input
                    id="person-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="person-goal">{t("form.goal")}</Label>
                  <Textarea
                    id="person-goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={t("form.goal.ph")}
                    maxLength={160}
                  />
                </div>
                <div>
                  <Label htmlFor="person-interests">{t("form.interests")}</Label>
                  <Input
                    id="person-interests"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder={t("form.interests.ph")}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{t("form.error")}</p>
                )}

                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={onClose}
                  >
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
