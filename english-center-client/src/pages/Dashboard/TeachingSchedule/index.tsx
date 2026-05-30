import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";

export default function DashboardTeachingSchedulePage() {
  return (
    <section>
      <DashboardListPageHeader
        title="Lịch giảng dạy"
        description="Theo dõi lịch dạy và các buổi học được phân công"
      />
      <SectionCard title="Lịch giảng dạy">
        <p className="text-sm text-gray-500">
          Lịch giảng dạy sẽ hiển thị khi có API danh sách buổi học theo giáo viên hoặc lớp được phân công.
        </p>
      </SectionCard>
    </section>
  );
}
