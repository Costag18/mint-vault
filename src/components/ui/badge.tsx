import { cn } from "@/lib/utils/cn";

const gradeColors: Record<string, string> = {
  PSA: "bg-tertiary text-on-tertiary",
  CGC: "bg-secondary text-on-secondary",
  BGS: "bg-tertiary text-on-tertiary",
  WATA: "bg-primary text-on-primary",
};

export function GradeBadge({
  grade,
  gradingService,
  className,
}: {
  grade?: string | null;
  gradingService?: string | null;
  className?: string;
}) {
  if (!grade) return null;
  const colorClass =
    gradeColors[gradingService ?? ""] ?? "bg-tertiary text-on-tertiary";
  return (
    <div
      className={cn(
        "px-3 py-1 rounded-full text-[10px] font-black font-label shadow-lg",
        colorClass,
        className
      )}
    >
      {grade}
    </div>
  );
}
