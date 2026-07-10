import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { Select } from "@/components/Comon/Select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost";
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
  selectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  bulkActions?: TableListAction<T>[];
  actions?: TableListAction<T>[];
  emptyText?: string;
  rowClassName?: (row: T, selected: boolean) => string;
  onRowClick?: (row: T) => void;
  onPageChange?: (page: number) => void;
  footer?: ReactNode;
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
  selectedRowIds,
  onSelectedRowIdsChange,
  bulkActions = [],
  actions = [],
  emptyText = "Không có dữ liệu.",
  rowClassName,
  onRowClick,
  onPageChange,
  footer,
}: TableListProps<T>) {
  const [internalSearch, setInternalSearch] = useState(searchValue ?? "");
  const [selectedBulkAction, setSelectedBulkAction] = useState<{ key: string; value: string } | null>(null);
  const controlledSearch = searchValue !== undefined;
  const currentSearch = controlledSearch ? searchValue : internalSearch;
  const selectedIds = selectedRowIds ?? [];

  useEffect(() => {
    if (controlledSearch) {
      setInternalSearch(searchValue ?? "");
    }
  }, [controlledSearch, searchValue]);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelectedBulkAction(null);
    }
  }, [selectedIds.length]);

  const allVisibleIds = useMemo(() => data.map(getRowId), [data, getRowId]);
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));
  const someSelected = allVisibleIds.some((id) => selectedIds.includes(id));

  const toggleRow = (rowId: string, checked: boolean) => {
    if (!onSelectedRowIdsChange) return;
    const next = checked
      ? Array.from(new Set([...selectedIds, rowId]))
      : selectedIds.filter((item) => item !== rowId);
    onSelectedRowIdsChange(next);
  };

  const toggleAll = (checked: boolean) => {
    if (!onSelectedRowIdsChange) return;
    onSelectedRowIdsChange(checked ? Array.from(new Set([...selectedIds, ...allVisibleIds])) : selectedIds.filter((id) => !allVisibleIds.includes(id)));
  };

  const runBulkAction = async (value: string) => {
    const action = bulkActions.find((item) => (item.value ?? item.label) === value);
    if (!action || selectedIds.length === 0) return;
    const rows = data.filter((row) => selectedIds.includes(getRowId(row)));
    await action.onClick(rows);
    setSelectedBulkAction(null);
  };

  return (
    <div className="overflow-hidden border bg-card text-card-foreground shadow-sm">
      {/* Header Section */}
      <div className="border-b px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            {title && <h3 className="truncate text-base font-semibold tracking-tight">{title}</h3>}
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>

          <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
            {selectedIds.length > 0 && (
              <Badge variant="secondary" className="font-normal">
                Đã chọn {selectedIds.length}
              </Badge>
            )}

            {selectedIds.length > 0 && bulkActions.length > 0 && (
              <div className="w-[200px]">
                <Select
                  value={selectedBulkAction}
                  options={bulkActions.map((action) => ({
                    key: action.label,
                    value: action.value ?? action.label,
                  }))}
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
              <Button
                key={action.label}
                type="button"
                variant={action.variant ?? "outline"}
                size="sm"
                disabled={action.disabled || selectedIds.length === 0}
                onClick={() => void action.onClick(data.filter((row) => selectedIds.includes(getRowId(row))))}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {searchable && (
          <div className="relative mt-4 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={currentSearch}
              onChange={(event) => {
                if (controlledSearch) {
                  onSearchChange?.(event.target.value);
                } else {
                  setInternalSearch(event.target.value);
                  onSearchChange?.(event.target.value);
                }
              }}
              placeholder={searchPlaceholder}
              className="h-9 pl-9"
            />
          </div>
        )}
      </div>

      {/* Table Section (Pure HTML + Tailwind) */}
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="hover:bg-muted/40">
              {onSelectedRowIdsChange && (
                <th className="w-12 px-4 py-3 text-left align-middle">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    aria-checked={someSelected && !allSelected ? "mixed" : allSelected}
                    onChange={(event) => toggleAll(event.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left align-middle text-xs font-medium uppercase tracking-wider text-muted-foreground",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="[&_tr:last-child]:border-0">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectedRowIdsChange ? 1 : 0)}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Đang tải...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectedRowIdsChange ? 1 : 0)}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const rowId = getRowId(row);
                const selected = selectedIds.includes(rowId);
                return (
                  <tr
                    key={rowId}
                    data-state={selected ? "selected" : undefined}
                    className={cn(
                      "border-b transition-colors last:border-0 hover:bg-muted/50 data-[state=selected]:bg-muted",
                      onRowClick && "cursor-pointer",
                      rowClassName?.(row, selected)
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {onSelectedRowIdsChange && (
                      <td className="w-12 px-4 py-3 align-middle">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event) => toggleRow(rowId, event.target.checked)}
                          onClick={(event) => event.stopPropagation()}
                          className="h-4 w-4 rounded border-border accent-primary"
                        />
                      </td>
                    )}

                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn("px-4 py-3 align-middle text-sm", column.className)}
                      >
                        {column.render
                          ? column.render(row)
                          : (row as Record<string, React.ReactNode>)?.[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination Section */}
      {(pagination || footer) && (
        <div className="flex flex-col items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3 sm:flex-row sm:px-6">
          <div className="text-sm text-muted-foreground">
            {pagination && (
              <>
                Hiển thị trang <span className="font-medium text-foreground">{pagination.page}</span> / {pagination.total_pages}
                <span className="mx-1.5">·</span>
                <span className="font-medium text-foreground">{pagination.total_items}</span> bản ghi
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {footer}
            {pagination && (
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!pagination.has_previous}
                  onClick={() => onPageChange?.(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!pagination.has_next}
                  onClick={() => onPageChange?.(pagination.page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TableList;
