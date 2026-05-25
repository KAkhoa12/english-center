import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
        <ShoppingCart className="h-6 w-6 text-brand-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">Giỏ hàng đang trống</h2>
      <p className="mt-2 text-sm text-gray-500">
        Hãy thêm khóa học bạn quan tâm để bắt đầu lộ trình học tập.
      </p>
      <button
        type="button"
        onClick={() => navigate("/courses")}
        className="mt-5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
      >
        Khám phá khóa học
      </button>
    </div>
  );
}

