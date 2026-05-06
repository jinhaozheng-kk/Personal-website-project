import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "dot" | "grid";
  fade?: boolean;
};

export function PatternBackground({
  variant = "dot",
  fade = true,
  className,
  children,
  ...rest
}: Props) {
  const pattern =
    variant === "dot"
      ? "[background-image:radial-gradient(rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:18px_18px]"
      : "[background-image:linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:36px_36px]";

  return (
    <div
      className={cn(
        "relative w-full bg-white",
        className,
      )}
      {...rest}
    >
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0", pattern)}
      />
      {fade && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_75%)]"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
