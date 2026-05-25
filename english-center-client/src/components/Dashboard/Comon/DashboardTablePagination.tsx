import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Pagination as PaginationMeta } from "@/shared/types/response";

type DashboardTablePaginationProps = {
  pagination: PaginationMeta | null;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const DashboardTablePagination = ({
  pagination,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: DashboardTablePaginationProps) => {
  if (!pagination) return null;

  const { page, page_size, total_pages, has_next, has_previous } = pagination;

  return (
    <div className="mt-4 flex items-center justify-end gap-3">
      <Select value={String(page_size)} onValueChange={(value) => onPageSizeChange(Number(value))}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Số dòng" />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size} / trang
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Trước"
              onClick={(event) => {
                event.preventDefault();
                if (has_previous) onPageChange(page - 1);
              }}
              className={!has_previous ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#" isActive>
              {page} / {Math.max(total_pages, 1)}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              text="Sau"
              onClick={(event) => {
                event.preventDefault();
                if (has_next) onPageChange(page + 1);
              }}
              className={!has_next ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
