import { cn, hueFromString, initials } from "@/lib/utils";
import {
  Avatar as AvatarRoot,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
  rounded?: "full" | "xl" | "2xl";
}

export function Avatar({
  name,
  src,
  size = 48,
  className,
  rounded = "full",
}: UserAvatarProps) {
  const hue = hueFromString(name);
  const radiusClass =
    rounded === "full" ? "rounded-full" :
    rounded === "xl"   ? "rounded-xl"   :
                         "rounded-2xl";

  return (
    <AvatarRoot
      className={cn(radiusClass, className)}
      style={{ width: size, height: size, minWidth: size }}
    >
      {src && (
        <AvatarImage src={src} alt={name} className={radiusClass} />
      )}
      <AvatarFallback
        className={cn(radiusClass, "font-semibold text-white select-none")}
        style={{
          fontSize: Math.round(size * 0.36),
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
