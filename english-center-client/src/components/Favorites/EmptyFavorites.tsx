import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyFavorites() {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-50">
        <Heart className="h-6 w-6 text-pink-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">
        Chưa có khóa học yêu thích
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Hãy lưu khóa học bạn quan tâm để so sánh và đăng ký nhanh hơn.
      </p>
      <button
        type="button"
        onClick={() => navigate("/courses")}
        className="mt-5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
      >
        Xem khóa học
      </button>
    </div>
  );
}

