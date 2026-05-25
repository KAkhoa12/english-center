import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  Icon: LucideIcon;
  tone?: "brand" | "accent" | "sun" | "coral";
};

const toneClasses = {
  brand: "bg-brand-50 text-brand-600",
  accent: "bg-accent-50 text-accent-600",
  sun: "bg-amber-50 text-sun-500",
  coral: "bg-orange-50 text-coral-500",
};

export const StatCard = ({
  title,
  value,
  change,
  Icon,
  tone = "brand",
}: StatCardProps) => {
  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <div className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
            {value}
          </div>
        </div>
        <div className={`rounded-2xl p-3 ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-5 text-sm font-medium text-accent-600">{change}</p>
    </article>
  );
};
