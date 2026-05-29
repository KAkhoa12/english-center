# Kỹ năng thiết kế giao diện đồng nhất (React + Shadcn + Tailwind)

## Nguyên tắc chung
- Dùng **Shadcn UI** components: Button, Input, Select, Table, Card, Form (nếu có),…
- Layout dùng Tailwind: `flex`, `grid`, `gap`, `p-4`, `rounded-2xl`, `border-gray-100`, `bg-white`.
- Responsive: `grid-cols-1 md:grid-cols-2 xl:grid-cols-4`.
- Toast: dùng thư viện **sonner** (`toast.success`, `toast.error`).

## 1. Trang danh sách (List)

### Cấu trúc chính
```tsx
<section>
  <DashboardListPageHeader title="..." description="..." />
  
  {/* Thanh tìm kiếm + nút thêm mới */}
  <div className="mb-4 flex flex-wrap items-center gap-2">
    <Input placeholder="Tìm kiếm..." className="max-w-sm" />
    <Button>Tìm kiếm</Button>
    <Button variant="outline" onClick={() => navigate(createPath)}>
      Thêm mới
    </Button>
  </div>

  {/* Bộ lọc nâng cao (grid card) */}
  <div className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-gray-100 bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
    <Select>...</Select>
    <Input placeholder="Khoảng giá" />
    {/* ... các filter khác */}
    <div className="flex items-center gap-2">
      <Select /><Button variant="outline" onClick={resetFilters}>Xóa lọc</Button>
    </div>
  </div>

  {/* Table riêng */}
  <CoursesListTable
    data={courses}
    loading={isLoading}
    pagination={pagination}
    onPageChange={setPage}
    onPageSizeChange={setPageSize}
  />
</section>
```

### Ghi chú:
- `DashboardListPageHeader` là component dùng chung (title, description).
- Bộ lọc thường có: trạng thái, danh mục, tag, trình độ, khoảng giá, sắp xếp.
- Khi thay đổi filter → reset về `page=1`.
- Nút "Xóa lọc" reset tất cả state filter về giá trị mặc định.
- `CoursesListTable` là component riêng của module đó 

## 2. Trang chỉnh sửa (Edit)

### Cấu trúc
```tsx
export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCourse, isLoading, getCourse, updateCourse, ... } = useStore();

  useEffect(() => {
    if (id) getCourse(id);
    return () => clearSelectedCourse();
  }, [id]);

  if (!selectedCourse) return <LoadingSkeleton />;

  return (
    <section>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Chỉnh sửa</h2>
          <p className="mt-1 text-sm text-gray-500">Mô tả ngắn</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* NẾu có ThumbnailField thì để */}
        <ThumbnailField currentImageUrl={...} file={thumbnailFile} onFileChange={setThumbnailFile} /> 
        <BasicInfoForm course={selectedCourse} onSubmit={handleUpdate} />
        {/* Các editor riêng: requirements, outcomes ... */}
      </div>
    </section>
  );
}
```

### Ghi chú:
- Dùng `useParams` lấy id.
- Gọi `getCourse` trong `useEffect`.
- Clear store khi unmount.
- Thường có upload ảnh riêng, gọi `uploadThumbnail` sau khi update thành công.
- Mỗi phần (requirements, outcomes) thường có component editor riêng với các action create/update/delete.

## 3. Trang tạo mới (Create)

### Cấu trúc
```tsx
export default function CreatePage() {
  const navigate = useNavigate();
  const { createCourse, isLoading } = useStore();
  const [formData, setFormData] = useState({...});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    try {
      const created = await createCourse(formData);
      if (thumbnailFile) await uploadThumbnail(created.id, thumbnailFile);
      toast.success("Tạo thành công");
      navigate(editPath.replace(":id", created.id));
    } catch {
      toast.error("Tạo thất bại");
    }
  };

  return (
    <section>
      <DashboardListPageHeader title="Tạo mới" description="..." />
      <div className="space-y-5">
        <ThumbnailField file={thumbnailFile} onFileChange={setThumbnailFile} />
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input placeholder="Tên" value={name} onChange={...} />
            {/* ... các field khác */}
          </div>
          <Textarea placeholder="Mô tả" rows={4} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>Lưu</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Ghi chú:
- Không bắt buộc dùng `react-hook-form`, có thể dùng `useState` cho form đơn giản.
- Sau khi tạo xong, thường chuyển sang trang edit để nhập thêm các phần chi tiết (requirements, outcomes).
- Upload thumbnail sau khi có `created.id`.

## 4. Sử dụng service store (Zustand) kết hợp toast

### Pattern chung
- Sử dụng các store trong english-center-client/src/services/<module>.store.ts để thực thi hành động

### Sử dụng trong component
```tsx
const { listCourses, courses, isLoading, pagination } = useCoursesStore();

// Gọi API kèm toast
const loadData = async () => {
  try {
    const result = await listCourses({ page, pageSize, ...filters });
    if (result.success) {
      toast.success(result.message || "thành công");
      navigate("/view",);
    } else {
      toast.error(result.message || "Thất bại");
    }
  } catch (error) {
    const fallbackMessage = storeError || "Đăng nhập thất bại";
    const message =
      error instanceof Error && error.message ? error.message : fallbackMessage;
    toast.error(message);
  }
};

// Xử lý submit form ví dụ
const handleSave = async () => {
  try {
    const result = await login({ email, password });
    if (result.success) {
      toast.success(result.message || "Đăng nhập thành công");
      navigate("/", { replace: true });
    } else {
      toast.error(result.message || "Đăng nhập thất bại");
    }
  } catch (error) {
    const fallbackMessage = storeError || "Đăng nhập thất bại";
    const message =
      error instanceof Error && error.message ? error.message : fallbackMessage;
    toast.error(message);
  }
};
```

### Quy tắc bắt buộc:
- Hiển thị **toast.success** khi thành công, **toast.error** khi thất bại (dùng `error.message` từ server nếu có).
- Với action upload ảnh, gọi sau khi tạo/update thành công.
- Khi có nhiều action liên tiếp (ví dụ update course + upload ảnh), nên có loading state riêng hoặc dùng `Promise.all` nhưng cẩn thận với rollback.
- Không được đưa hết âấu trúc code xử lý vào cùng 1 trang, hãy tách nó ra thành các component con và đưa vào /src/components/dashboard/ tương ứng 
- Khi quyết định làm hãy xem qua cấu trúc và phân tích xem các bước cần làm tiếp theo là gì, đưa hướng xử lý và trả về phần thống kê. Khi đã thống nhất hướng xử lý thì phải đợi xác nhận sau đó mới thực hiện

Khi chỉnh xong hoàn tất và build không gặp lỗi thì chỉ cần thông báo các file đã chỉnh sửa và kết luận nhỏ, nếu gặp lỗi thì hãy build lại xem xét lỗi nếu vẫn gặp lỗi thì hãy tìm hiểu lý do và sửa lại.
## 5. Những điểm thiếu (cần bổ sung cho agent rõ hơn)

- **Xác nhận xóa**: Dùng `AlertDialog` (shadcn) trước khi gọi `deleteAction`.  
- **Loading skeleton**: Khi `isLoading` true, thay table bằng Skeleton (shadcn `<Skeleton />`).  
- **Empty state**: Khi mảng rỗng và không loading, hiển thị dòng "Không có dữ liệu" trong bảng.  
- **Phân trang**: Dùng component `Pagination` của shadcn hoặc tự xây dựng dựa trên `pagination` object từ store.  
- **Reset filter**: Hàm reset phải set lại tất cả state filter về giá trị mặc định và gán `page=1`.  
- **Form validation**: Với form phức tạp nên dùng `react-hook-form` + `zod`, với form đơn giản có thể dùng `useState` và kiểm tra thủ công.

Nếu agent cần triển khai một trang mới, phải tuân thủ đúng các pattern trên và tham khảo các file có sẵn như `DashboardCoursesPage`, `DashboardCourseEditPage`, `DashboardCourseCreatePage`.
