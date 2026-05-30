import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useCartStore } from "@/services/cart/cart.store";
import type { WishlistItem } from "@/services/wishlist/wishlist.type";

type FavoriteCourseCardProps = {
  item: WishlistItem;
  onRemove: (courseId: string) => void;
};

export default function FavoriteCourseCard({
  item,
  onRemove,
}: FavoriteCourseCardProps) {
  const navigate = useNavigate();
  const { addCartItem } = useCartStore();
  const [adding, setAdding] = useState(false);

  const { course } = item;

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addCartItem({ course_id: course.id });
      toast.success("Đã thêm khóa học vào giỏ hàng");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thêm vào giỏ hàng thất bại");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="card-hover group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-52 overflow-hidden">
        <img
          src={course.thumbnail_url || "https://picsum.photos/seed/course-fav/600/400.jpg"}
          alt={course.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">
            {course.target_level || "Tổng quát"}
          </span>
          <span className="text-xs font-medium text-gray-400">•</span>
          <span className="text-xs font-medium text-gray-500">
            {course.total_sessions ? `${course.total_sessions} buổi` : "Đang cập nhật"}
          </span>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">{course.name}</h2>
        <p className="mb-5 text-sm leading-relaxed text-gray-500">
          {course.description || "Khóa học đang được cập nhật mô tả chi tiết."}
        </p>
        <div className="mb-4">
          <span className="text-2xl font-bold text-brand-600">
            {course.price.toLocaleString("vi-VN")}
          </span>
          <span className="ml-1 text-xs text-gray-400">VNĐ/khóa</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {adding ? "Đang thêm..." : "Thêm giỏ hàng"}
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.course_id)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-pink-100 text-pink-500 transition-colors hover:bg-pink-50"
            aria-label="Xóa yêu thích"
          >
            <Heart className="h-4 w-4 fill-pink-500" />
          </button>
          <button
            type="button"
            onClick={() => navigate(`/course/${course.slug || course.id}`)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500 transition-colors hover:bg-brand-500 hover:text-white"
            aria-label="Xem chi tiết khóa học"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
