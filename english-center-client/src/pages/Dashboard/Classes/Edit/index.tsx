import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClassesStore } from "@/services/classes/classes.store";
import { PRIVATE_ROUTES } from "@/shared/routes";

export default function DashboardClassEditPage() {
  const { classId = "" } = useParams();
  const navigate = useNavigate();
  const { selectedClass, getClass, updateClass, deleteClass, clearSelectedClass } = useClassesStore();
  const [name, setName] = useState("");
  const [classType, setClassType] = useState("offline");
  const [maxStudents, setMaxStudents] = useState(20);

  useEffect(() => {
    if (!classId) return;
    void getClass(classId).then((item) => {
      setName(item.name);
      setClassType(item.class_type);
      setMaxStudents(item.max_students);
    }).catch(() => toast.error("Khong the tai lop hoc"));
    return () => clearSelectedClass();
  }, [classId, getClass, clearSelectedClass]);

  const handleSave = async () => {
    try {
      await updateClass(classId, { name, class_type: classType, max_students: maxStudents });
      toast.success("Cap nhat lop hoc thanh cong");
      navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cap nhat lop hoc that bai");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClass(classId);
      toast.success("Xoa lop hoc thanh cong");
      navigate(PRIVATE_ROUTES.DASHBOARD_CLASSES);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xoa lop hoc that bai");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Chinh sua lop hoc" description={selectedClass?.course?.name ?? "Cap nhat thong tin lop hoc"} />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ten lop" />
          <Select value={classType} onValueChange={setClassType}><SelectTrigger><SelectValue placeholder="Loai lop" /></SelectTrigger><SelectContent><SelectItem value="offline">Offline</SelectItem><SelectItem value="online">Online</SelectItem></SelectContent></Select>
          <Input type="number" min={1} value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value || 1))} placeholder="Si so toi da" />
        </div>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => navigate(-1)}>Quay lai</Button><Button variant="destructive" onClick={() => void handleDelete()}>Xoa</Button><Button onClick={() => void handleSave()}>Luu</Button></div>
      </div>
    </section>
  );
}
