import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type DashboardRowActionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

export const DashboardRowActions = ({
  onEdit,
  onDelete,
  className,
}: DashboardRowActionsProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const close = (fn?: () => void) => {
    setOpen(false);
    fn?.();
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150",
          "text-faint hover:text-ink hover:bg-surface-soft",
          open && "text-ink bg-surface-soft",
        )}
        aria-label="Thao tác"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-xl border border-line bg-white shadow-card-hover">
          <div className="p-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => close(onEdit)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-body transition-colors hover:bg-surface-soft"
              >
                <Pencil className="h-4 w-4 text-faint" />
                Sửa
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => close(onDelete)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-coral transition-colors hover:bg-coral/5"
              >
                <Trash2 className="h-4 w-4" />
                Xóa
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
