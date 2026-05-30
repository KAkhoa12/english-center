import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";

export default function DashboardCertificatesPage() {
  return (
    <section>
      <DashboardListPageHeader
        title="Chứng chỉ"
        description="Theo dõi chứng chỉ và thành tích học tập"
      />
      <SectionCard title="Chứng chỉ của tôi">
        <p className="text-sm text-gray-500">Chưa có chứng chỉ nào được cấp.</p>
      </SectionCard>
    </section>
  );
}
