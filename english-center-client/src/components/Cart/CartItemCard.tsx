import { Trash2 } from "lucide-react";

export type CartItem = {
  id: string;
  cartItemId: string;
  title: string;
  courseCode: string;
  classId: string | null;
  className: string | null;
  classCode: string | null;
  classStartDate: string | null;
  quantity: number;
  price: number;
};

type CartItemCardProps = {
  item: CartItem;
  onRemove: (id: string) => void;
};

export default function CartItemCard({ item, onRemove }: CartItemCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">
              {item.courseCode}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-500">SL: {item.quantity}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
          <p className="mt-2 text-sm text-gray-500">
            {item.classId
              ? `Lớp đã chọn: ${item.className || item.classId}`
              : "Khóa tự học, không cần chọn lớp"}
          </p>
          {item.classId ? (
            <p className="mt-1 text-xs text-gray-400">
              {item.classCode || "Chưa có mã lớp"} · Khai giảng:{" "}
              {item.classStartDate
                ? new Date(item.classStartDate).toLocaleDateString("vi-VN")
                : "Đang cập nhật"}
            </p>
          ) : null}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-brand-600">
            {item.price.toLocaleString("vi-VN")}{" "}
            <span className="text-xs font-normal text-gray-400">VNĐ</span>
          </p>
          <button
            type="button"
            onClick={() => onRemove(item.cartItemId)}
            className="inline-flex items-center gap-1 rounded-full border border-red-100 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Xóa
          </button>
        </div>
      </div>
    </article>
  );
}
