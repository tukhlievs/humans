import { cn, hueFromString, initials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
  rounded?: "full" | "xl";
}

export function Avatar({ name, src, size = 48, className, rounded = "full" }: AvatarProps) {
  const hue = hueFromString(name);
  const radius = rounded === "full" ? "rounded-full" : "rounded-2xl";

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn(radius, "object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        radius,
        "flex shrink-0 items-center justify-center font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(140deg, hsl(${hue} 70% 26%), hsl(${(hue + 28) % 360} 78% 42%))`,
      }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
