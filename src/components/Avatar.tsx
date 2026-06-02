import { cn, hueFromString, initials } from "@/lib/utils";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
  rounded?: "full" | "xl" | "2xl";
}

export function Avatar({ name, src, size = 48, className, rounded = "full" }: AvatarProps) {
  const hue = hueFromString(name);
  const radius =
    rounded === "full" ? "rounded-full" :
    rounded === "xl"   ? "rounded-xl"   :
                         "rounded-2xl";
  const fontSize = Math.round(size * 0.36);

  return (
    <AvatarRoot
      className={cn(radius, className)}
      style={{ width: size, height: size, minWidth: size }}
    >
      {src && (
        <AvatarImage
          src={src}
          alt={name}
          className={radius}
        />
      )}
      <AvatarFallback
        className={cn(
          radius,
          "font-semibold text-white select-none",
        )}
        style={{
          fontSize,
          background: `linear-gradient(145deg,
            hsl(${hue} 65% 24%),
            hsl(${(hue + 25) % 360} 80% 40%)
          )`,
        }}
        delayMs={0}
      >
        {initials(name)}
      </AvatarFallback>
    </AvatarRoot>
  );
}
