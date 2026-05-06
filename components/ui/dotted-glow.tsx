import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function DottedGlow({ className, children, ...rest }: Props) {
  return (
    <div className={cn("relative overflow-hidden bg-white", className)} {...rest}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:18px_18px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_0%,black_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.07),transparent_70%)] blur-2xl"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
