import { DashboardListPageHeader, SectionCard } from "@/components/Dashboard/Comon";

export default function DashboardMessagesPage() {
  return (
    <section>
      <DashboardListPageHeader
        title="Tin nhắn"
        description="Trao đổi giữa học viên, giáo viên và trung tâm"
      />
      <SectionCard title="Hộp thư">
        <p className="text-sm text-gray-500">Chưa có cuộc trò chuyện nào.</p>
      </SectionCard>
    </section>
  );
}
