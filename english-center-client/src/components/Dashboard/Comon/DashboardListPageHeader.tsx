import type { ReactNode } from "react";

type DashboardListPageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export const DashboardListPageHeader = ({
  title,
  description,
  actions,
}: DashboardListPageHeaderProps) => {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {actions}
    </div>
  );
};
