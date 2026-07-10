import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type MutilSelectOption = {
  key: string;
  value: string;
  disabled?: boolean;
};

type MutilSelectProps = {
  value: MutilSelectOption[];
  options: MutilSelectOption[];
  onChange: (value: MutilSelectOption[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  is_search?: boolean;
  className?: string;
};

export const MutilSelect = ({
  value,
  options,
  onChange,
  placeholder = "Chọn giá trị",
  searchPlaceholder = "Tìm kiếm...",
  emptyText = "Không có dữ liệu",
  disabled = false,
  is_search = false,
  className,
}: MutilSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current || rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!is_search || !search.trim()) return options;
    const keyword = search.trim().toLowerCase();
    return options.filter(
      (option) =>
        option.key.toLowerCase().includes(keyword) ||
        option.value.toLowerCase().includes(keyword),
    );
  }, [is_search, options, search]);

  const isSelected = (option: MutilSelectOption) =>
    value.some((item) => item.key === option.key && item.value === option.value);

  const toggle = (option: MutilSelectOption) => {
    if (option.disabled) return;
    if (isSelected(option)) {
      onChange(value.filter((item) => !(item.key === option.key && item.value === option.value)));
      return;
    }
    onChange([...value, option]);
  };

  const removeItem = (e: React.MouseEvent | React.KeyboardEvent, item: MutilSelectOption) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(value.filter((s) => !(s.key === item.key && s.value === item.value)));
  };

  const MAX_VISIBLE_TAGS = 2;
  const visibleTags = value.slice(0, MAX_VISIBLE_TAGS);
  const remainingCount = value.length - MAX_VISIBLE_TAGS;

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex min-h-10 w-full items-center justify-between gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium transition-all duration-200",
          "border-line text-body",
          "hover:border-hover-line hover:bg-surface-soft",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-mint/15 focus-visible:border-mint",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "border-mint ring-4 ring-mint/15",
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1.5 overflow-hidden">
          {value.length > 0 ? (
            <>
              {visibleTags.map((item) => (
                <span
                  key={`${item.key}-${item.value}`}
                  className="inline-flex items-center gap-1 rounded-full bg-mint/10 border border-mint/20 px-2.5 py-0.5 text-[12px] font-semibold text-mint-deep"
                >
                  <span className="max-w-[100px] truncate">{item.key}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Bỏ chọn ${item.key}`}
                    className="rounded-full p-0.5 transition-colors hover:bg-mint/20 hover:text-ink"
                    onClick={(e) => removeItem(e, item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        removeItem(e, item);
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </span>
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-[12px] font-semibold text-muted">
                  +{remainingCount}
                </span>
              )}
            </>
          ) : (
            <span className="text-caption">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-300",
            open ? "-rotate-180 text-mint-deep" : "text-faint",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full min-w-[8rem] overflow-hidden rounded-2xl border border-line-soft bg-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.12)] animate-in fade-in-0 zoom-in-95 duration-200">
          {is_search && (
            <div className="flex items-center gap-2 border-b border-line-soft bg-surface-soft/50 px-4">
              <Search className="h-4 w-4 shrink-0 text-faint" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent py-3 text-sm text-body outline-none placeholder:text-faint"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-full p-1 text-faint transition-colors hover:bg-surface hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1.5 scrollbar-hidden">
            {filteredOptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                  <Search className="h-4 w-4 text-faint" />
                </div>
                <p className="text-sm font-medium text-muted">{emptyText}</p>
              </div>
            ) : (
              filteredOptions.map((option) => {
                const selected = isSelected(option);
                return (
                  <button
                    type="button"
                    key={`${option.key}-${option.value}`}
                    disabled={option.disabled}
                    onClick={() => toggle(option)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md my-1 px-3 py-2.5 pl-9 text-left text-sm outline-none transition-all duration-150",
                      "hover:bg-surface-soft",
                      selected
                        ? "bg-mint/10 font-semibold text-mint-deep hover:bg-mint/15"
                        : "text-body",
                      option.disabled && "pointer-events-none cursor-not-allowed opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-150",
                        selected
                          ? "bg-mint text-ink"
                          : "border border-line bg-white",
                      )}
                    >
                      {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>

                    <span className="flex-1 truncate">{option.key}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MutilSelect;
