import { cn } from "@/lib/utils";
import PixelHeart from "../icons/pixel-heart";

export default function Footer({ className }: { className?: string }) {
  return <footer className={cn("flex flex-row items-center justify-center gap-2 uppercase py-8", className)}>
    <span>
      by the community
    </span>

    <PixelHeart />

    <span>
      for the community
    </span>
  </footer>;
}