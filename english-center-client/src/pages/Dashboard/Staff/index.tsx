import { useEffect, useState } from "react";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { StaffListTable } from "@/components/Dashboard/Staff/StaffListTable";
import { Input } from "@/components/ui/input";
import { useStaffStore } from "@/services/staff/staff.store";

export const DashboardStaffPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { staff, pagination, isLoading, listStaff } = useStaffStore();

  useEffect(() => {
    void listStaff({ page, page_size: pageSize, search: search.trim() || undefined });
  }, [listStaff, page, pageSize, search]);

  return (
    <section>
      <DashboardListPageHeader
        title="Quản lý nhân viên"
        description="Theo dõi và quản trị danh sách nhân viên"
      />

      <div className="mb-4 max-w-sm">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo tên, email hoặc số điện thoại"
        />
      </div>

      <StaffListTable
        data={staff}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
    </section>
  );
};

export default DashboardStaffPage;
