import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-5xl font-semibold tracking-tight">404</p>
      <p className="mt-2 text-sm text-muted">Страница не найдена</p>
      <Link href="/" className={cn(buttonVariants({ variant: "secondary" }), "mt-6")}>
        На главную
      </Link>
    </div>
  );
}
