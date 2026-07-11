import { ChevronLeft, ChevronRight, CircleAlert, Inbox, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { Select } from "@/components/Comon/Select";
import type { Pagination } from "@/shared/types/response";
import { cn } from "@/lib/utils";

export type TableListColumn<T> = {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  render?: (row: T) => ReactNode;
};

export type TableListAction<T> = {
  value?: string;
  label: string;
  onClick: (rows: T[]) => void | Promise<void>;
  variant?: "default" | "outline" | "destructive" | "ghost";
  disabled?: boolean;
};

export type TableListProps<T> = {
  title?: string;
  description?: string;
  columns: TableListColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  pagination?: Pagination | null;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  selectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  bulkActions?: TableListAction<T>[];
  actions?: TableListAction<T>[];
  emptyText?: string;
  emptyIcon?: "inbox" | "alert";
  rowClassName?: (row: T, selected: boolean) => string;
  onRowClick?: (row: T) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  footer?: ReactNode;
  className?: string;
};

export function TableList<T>({
  title,
  description,
  columns,
  data,
  getRowId,
  pagination,
  loading = false,
  searchable = false,
  searchPlaceholder = "Tìm kiếm...",
  searchValue,
  onSearchChange,
  onSearchSubmit,
  selectedRowIds,
  onSelectedRowIdsChange,
  bulkActions = [],
  actions = [],
  emptyText = "Không có dữ liệu.",
  emptyIcon = "inbox",
  rowClassName,
  onRowClick,
  onPageChange,
  onPageSizeChange,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  footer,
  className,
}: TableListProps<T>) {
  const [internalSearch, setInternalSearch] = useState(searchValue ?? "");
  const [selectedBulkAction, setSelectedBulkAction] = useState<{ key: string; value: string } | null>(null);

  const controlledSearch = searchValue !== undefined;
  const currentSearch = controlledSearch ? searchValue : internalSearch;
  const selectedIds = selectedRowIds ?? [];
  const hasSelection = onSelectedRowIdsChange !== undefined;
  const showPageSize = onPageSizeChange !== undefined;

  // Thay thế useEffect bằng cách kiểm tra và reset trực tiếp trong render
  if (selectedIds.length === 0 && selectedBulkAction !== null) {
    setSelectedBulkAction(null);
  }

  const allVisibleIds = useMemo(() => data.map(getRowId), [data, getRowId]);
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));
  const someSelected = allVisibleIds.some((id) => selectedIds.includes(id)) && !allSelected;

  const toggleRow = (rowId: string, checked: boolean) => {
    if (!onSelectedRowIdsChange) return;
    onSelectedRowIdsChange(
      checked
        ? Array.from(new Set([...selectedIds, rowId]))
        : selectedIds.filter((item) => item !== rowId),
    );
  };

  const toggleAll = (checked: boolean) => {
    if (!onSelectedRowIdsChange) return;
    onSelectedRowIdsChange(
      checked
        ? Array.from(new Set([...selectedIds, ...allVisibleIds]))
        : selectedIds.filter((id) => !allVisibleIds.includes(id)),
    );
  };

  const runBulkAction = async (value: string) => {
    const action = bulkActions.find((item) => (item.value ?? item.label) === value);
    if (!action || selectedIds.length === 0) return;
    await action.onClick(data.filter((row) => selectedIds.includes(getRowId(row))));
    setSelectedBulkAction(null);
  };

  const colSpan = columns.length + (hasSelection ? 1 : 0);

  const pages = useMemo(() => {
    if (!pagination || pagination.total_pages <= 7) {
      return pagination ? Array.from({ length: pagination.total_pages }, (_, i) => i + 1) : [];
    }
    const p = pagination;
    const items: (number | "...")[] = [1];
    if (p.page > 3) items.push("...");
    for (let i = Math.max(2, p.page - 1); i <= Math.min(p.total_pages - 1, p.page + 1); i++) items.push(i);
    if (p.page < p.total_pages - 2) items.push("...");
    items.push(p.total_pages);
    return items;
  }, [pagination]);

  const EmptyIcon = emptyIcon === "alert" ? CircleAlert : Inbox;

  return (
    <div className={cn("overflow-hidden rounded-card border border-line bg-white", className)}>
      <div className="border-b border-line px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            {title && <h3 className="text-[15px] font-semibold text-ink tracking-tight">{title}</h3>}
            {description && <p className="mt-1 text-[13px] text-caption leading-relaxed">{description}</p>}
          </div>

          <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
            {selectedIds.length > 0 && (
              <span className="inline-flex h-6 items-center rounded-full bg-ink px-2.5 text-[11px] font-semibold text-white tabular-nums">
                {selectedIds.length} đã chọn
              </span>
            )}

            {selectedIds.length > 0 && bulkActions.length > 0 && (
              <div className="w-[200px]">
                <Select
                  value={selectedBulkAction}
                  options={bulkActions.map((a) => ({ key: a.label, value: a.value ?? a.label }))}
                  onChange={(option) => {
                    setSelectedBulkAction(option);
                    if (option) void runBulkAction(option.value);
                  }}
                  placeholder="Thao tác hàng loạt"
                  emptyText="Không có thao tác"
                />
              </div>
            )}

            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                disabled={action.disabled || selectedIds.length === 0}
                onClick={() => void action.onClick(data.filter((row) => selectedIds.includes(getRowId(row))))}
                className={cn(
                  "h-8 px-3.5 rounded-lg text-[13px] font-medium transition-colors duration-150",
                  "disabled:pointer-events-none disabled:opacity-30",
                  action.variant === "destructive"
                    ? "bg-coral/10 text-coral hover:bg-coral/20"
                    : action.variant === "ghost"
                      ? "text-muted hover:text-ink hover:bg-surface-soft"
                      : "bg-surface-soft border border-line text-body hover:bg-surface hover:border-hover-line",
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {searchable && (
          <form onSubmit={(e) => { e.preventDefault(); onSearchSubmit?.(); }} className="relative mt-4 max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              type="text"
              value={currentSearch}
              onChange={(e) => {
                if (!controlledSearch) setInternalSearch(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-lg border border-line bg-surface-soft pl-10 pr-3 text-sm text-ink placeholder:text-caption outline-none transition-colors duration-150 hover:border-hover-line focus:border-muted"
            />
          </form>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-soft/60">
              {hasSelection && (
                <th className="w-12 px-4 py-3 text-left align-middle">
                  <label className="flex h-5 w-5 cursor-pointer items-center justify-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => { if (el) el.indeterminate = someSelected; }}
                      onChange={(e) => toggleAll(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-2 border-line accent-mint"
                    />
                  </label>
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3 text-left align-middle text-[11px] font-semibold uppercase tracking-wider text-caption", col.headerClassName)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`s-${i}`} className="border-b border-line-soft last:border-0">
                  {hasSelection && <td className="px-4 py-3"><div className="h-4 w-4 animate-pulse rounded border-2 border-line-soft bg-line-soft" /></td>}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className={cn("h-4 animate-pulse rounded bg-line-soft", (col.key === "name" || col.key === "title") ? "w-3/5" : "w-2/5")} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-4 py-16">
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface">
                      <EmptyIcon className="h-6 w-6 text-faint" />
                    </div>
                    <p className="text-sm font-medium text-muted">{emptyText}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const rowId = getRowId(row);
                const selected = selectedIds.includes(rowId);
                return (
                  <tr
                    key={rowId}
                    className={cn(
                      "border-b border-line-soft transition-colors duration-100 last:border-0",
                      "hover:bg-surface-soft/60",
                      selected && "bg-mint/5",
                      onRowClick && "cursor-pointer",
                      rowClassName?.(row, selected),
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {hasSelection && (
                      <td className="px-4 py-3 align-middle" onClick={(e) => e.stopPropagation()}>
                        <label className="flex h-5 w-5 cursor-pointer items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => toggleRow(rowId, e.target.checked)}
                            className="h-4 w-4 cursor-pointer rounded border-2 border-line accent-mint"
                          />
                        </label>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3 align-middle text-[13px] text-body", col.className)}>
                        {col.render ? col.render(row) : (row as Record<string, React.ReactNode>)?.[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {(pagination || footer || showPageSize) && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-line bg-surface-soft/40 px-5 py-3.5 md:px-6 sm:flex-row">
          <div className="flex items-center gap-3 text-[13px] text-caption">
            {pagination && (
              <>
                Trang <span className="font-medium text-ink tabular-nums">{pagination.page}</span> / {pagination.total_pages}
                <span className="text-faint">·</span>
                <span className="font-medium text-ink tabular-nums">{pagination.total_items}</span> bản ghi
              </>
            )}

            {showPageSize && (
              <>
                {pagination && <span className="text-faint">·</span>}
                <Select
                  value={{ key: pageSize.toString(), value: pageSize.toString() }}
                  onChange={(option) => {
                    if (option) onPageSizeChange?.(Number(option.value));
                  }}
                  className="h-7 rounded-md border border-line bg-white px-2 text-[13px] text-body outline-none transition-colors hover:border-hover-line focus:border-muted"
                  options={pageSizeOptions.map((size) => ({ key: size.toString(), value: size.toString() }))}
                />
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {footer}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={!pagination.has_previous}
                  onClick={() => onPageChange?.(pagination.page - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-caption transition-colors hover:bg-surface-soft hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {pages.map((p, i) =>
                  p === "..." ? (
                    <span key={`d-${i}`} className="flex h-8 w-8 items-center justify-center text-[13px] text-faint">...</span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onPageChange?.(p)}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors",
                        p === pagination.page ? "bg-ink text-white" : "text-muted hover:bg-surface-soft hover:text-ink",
                      )}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  disabled={!pagination.has_next}
                  onClick={() => onPageChange?.(pagination.page + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-caption transition-colors hover:bg-surface-soft hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TableList;
