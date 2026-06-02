"use client";

import { useState, type FormEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  const [name, setName]         = useState("");
  const [goal, setGoal]         = useState("");
  const [interests, setInterests] = useState("");
  const [pending, setPending]   = useState(false);
  const [error, setError]       = useState(false);

  const reset = () => {
    setName(""); setGoal(""); setInterests(""); setError(false);
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
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-md rounded-t-2xl pb-[calc(env(safe-area-inset-bottom)+16px)]"
      >
        <SheetHeader className="mb-4 text-left">
          <SheetTitle>{t("form.title")}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pname">{t("form.name")}</Label>
            <Input
              id="pname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pgoal">{t("form.goal")}</Label>
            <Textarea
              id="pgoal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder={t("form.goal.ph")}
              maxLength={160}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pinterests">{t("form.interests")}</Label>
            <Input
              id="pinterests"
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
      </SheetContent>
    </Sheet>
  );
}
