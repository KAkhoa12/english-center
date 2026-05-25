import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export const SectionCard = ({ title, action, children }: SectionCardProps) => {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-950">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
};
