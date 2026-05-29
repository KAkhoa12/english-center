import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClassesStore } from "@/services/classes/classes.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardClassCreatePage() {
  const navigate = useNavigate();
  const { createClass } = useClassesStore();
  const [courseId, setCourseId] = useState("");
  const [name, setName] = useState("");
  const [classType, setClassType] = useState("offline");
  const [maxStudents, setMaxStudents] = useState(20);

  const handleSubmit = async () => {
    try {
      const created = await createClass({ course_id: courseId, name, class_type: classType, max_students: maxStudents });
      toast.success("Tao lop hoc thanh cong");
      navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES_EDIT.replace(":classId", created.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Tao lop hoc that bai");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Tao lop hoc" description="Them lop hoc moi" />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="Course ID" />
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ten lop" />
          <Select value={classType} onValueChange={setClassType}><SelectTrigger><SelectValue placeholder="Loai lop" /></SelectTrigger><SelectContent><SelectItem value="offline">Offline</SelectItem><SelectItem value="online">Online</SelectItem></SelectContent></Select>
          <Input type="number" min={1} value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value || 1))} placeholder="Si so toi da" />
        </div>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => navigate(-1)}>Quay lai</Button><Button onClick={() => void handleSubmit()}>Luu</Button></div>
      </div>
    </section>
  );
}
