import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classesApi } from "@/services/classes/classes.api";
import { coursesApi } from "@/services/courses/courses.api";
import { useOrdersStore } from "@/services/orders/orders.store";
import type { ClassItem } from "@/services/classes/classes.type";
import type { CourseListItem } from "@/services/courses/courses.type";
import type { Student } from "@/services/students/students.type";
import { studentsApi } from "@/services/students/students.api";
import { PRIVATE_ROUTES } from "@/shared/routes";

type Step = "student" | "course" | "plan" | "confirm";

export default function DashboardOrderCreatePage() {
  const navigate = useNavigate();
  const { createOrderForStudent } = useOrdersStore();

  const [step, setStep] = useState<Step>("student");

  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseListItem | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  const [planType, setPlanType] = useState("full");
  const [depositAmount, setDepositAmount] = useState("");
  const [installments, setInstallments] = useState<{ due_date: string; amount: string; note: string }[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    studentsApi.listStudents({ page: 1, page_size: 20, search: studentSearch || undefined }).then((res) => {
      if (res.success) setStudents(res.payload);
    });
  }, [studentSearch]);

  useEffect(() => {
    coursesApi.listCourses({ page: 1, page_size: 100, mode: "center" }).then((res) => {
      if (res.success) setCourses(res.payload);
    });
  }, []);

  const loadClasses = async (courseId: string) => {
    const res = await classesApi.listCourseClasses(courseId, { page: 1, page_size: 100 });
    if (res.success) setClasses(res.payload);
  };

  const handleCreate = async () => {
    if (!selectedStudent || !selectedCourse || !selectedClass) return;
    try {
      const order = await createOrderForStudent({
        student_id: selectedStudent.id,
        course_id: selectedCourse.id,
        class_id: selectedClass.id,
        note: note || undefined,
        plan_type: planType !== "full" ? planType : undefined,
        deposit_amount: depositAmount ? Number(depositAmount) : undefined,
        installments: installments
          .filter((i) => i.due_date && i.amount)
          .map((i) => ({ due_date: i.due_date, amount: Number(i.amount), note: i.note || undefined })),
      });
      toast.success("Tao don hang thanh cong");
      navigate(PRIVATE_ROUTES.DASHBOARD_FINANCE_INVOICES_EDIT.replace(":invoiceId", order.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Tao don hang that bai");
    }
  };

  const addInstallment = () => setInstallments([...installments, { due_date: "", amount: "", note: "" }]);

  const updateInstallment = (i: number, field: string, value: string) => {
    const copy = [...installments];
    (copy[i] as Record<string, string>)[field] = value;
    setInstallments(copy);
  };

  const removeInstallment = (i: number) => setInstallments(installments.filter((_, idx) => idx !== i));

  return (
    <section>
      <DashboardListPageHeader title="Tao don hang" description="Tao don hang moi cho hoc vien" />
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5">
        {step === "student" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chon hoc vien</h3>
            <Input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Tim kiem hoc vien..." />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {students.map((s) => (
                <div
                  key={s.id}
                  className={`cursor-pointer rounded-lg border p-3 transition ${selectedStudent?.id === s.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"}`}
                  onClick={() => { setSelectedStudent(s); setStep("course"); }}
                >
                  <p className="font-medium">{s.user.full_name}</p>
                  <p className="text-sm text-gray-500">{s.user.email}</p>
                  <p className="text-sm text-gray-500">{s.user.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "course" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chon khoa hoc & lop</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className={`cursor-pointer rounded-lg border p-3 transition ${selectedCourse?.id === c.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"}`}
                  onClick={() => { setSelectedCourse(c); setSelectedClass(null); loadClasses(c.id); }}
                >
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.code} - {c.price?.toLocaleString()} VND</p>
                </div>
              ))}
            </div>
            {selectedCourse && (
              <div>
                <p className="mb-2 font-medium">Lop hoc:</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {classes.map((cl) => (
                    <div
                      key={cl.id}
                      className={`cursor-pointer rounded-lg border p-3 transition ${selectedClass?.id === cl.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"}`}
                      onClick={() => setSelectedClass(cl)}
                    >
                      <p className="font-medium">{cl.name}</p>
                      <p className="text-sm text-gray-500">{cl.code} - Si so: {cl.current_students_count}/{cl.max_students}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("student")}>Quay lai</Button>
              <Button disabled={!selectedClass} onClick={() => setStep("plan")}>Tiep theo</Button>
            </div>
          </div>
        )}

        {(step === "plan" || step === "confirm") && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thong tin don hang</h3>
            <div className="rounded-lg bg-gray-50 p-3">
              <p><strong>Hoc vien:</strong> {selectedStudent?.user.full_name} ({selectedStudent?.user.email})</p>
              <p><strong>Khoa hoc:</strong> {selectedCourse?.name}</p>
              <p><strong>Lop:</strong> {selectedClass?.name}</p>
              <p><strong>So tien:</strong> {selectedCourse?.price?.toLocaleString()} VND</p>
            </div>

            <div>
              <p className="mb-2 font-medium">Hinh thuc thanh toan</p>
              <Select value={planType} onValueChange={setPlanType}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Thanh toan toan bo</SelectItem>
                  <SelectItem value="deposit_then_full">Dat coc + thanh toan sau</SelectItem>
                  <SelectItem value="installment">Tra gop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {planType === "deposit_then_full" && (
              <Input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} type="number" placeholder="So tien dat coc" />
            )}

            {planType === "installment" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cac dot thanh toan</span>
                  <Button variant="outline" size="sm" onClick={addInstallment}>+ Them dot</Button>
                </div>
                {installments.map((inst, i) => (
                  <div key={i} className="flex flex-wrap items-end gap-2 rounded-lg border p-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Ngay den han</label>
                      <Input value={inst.due_date} onChange={(e) => updateInstallment(i, "due_date", e.target.value)} type="date" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">So tien</label>
                      <Input value={inst.amount} onChange={(e) => updateInstallment(i, "amount", e.target.value)} type="number" placeholder="0" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Ghi chu</label>
                      <Input value={inst.note} onChange={(e) => updateInstallment(i, "note", e.target.value)} placeholder="Ghi chu" />
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => removeInstallment(i)}>Xoa</Button>
                  </div>
                ))}
              </div>
            )}

            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Ghi chu don hang" />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("course")}>Quay lai</Button>
              <Button onClick={() => void handleCreate()}>Tao don hang</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
