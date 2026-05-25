import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type FavoriteCourse = {
  id: string;
  title: string;
  audience: string;
  duration: string;
  price: number;
  image: string;
  description: string;
};

type FavoriteCourseCardProps = {
  item: FavoriteCourse;
  onRemove: (id: string) => void;
};

export default function FavoriteCourseCard({
  item,
  onRemove,
}: FavoriteCourseCardProps) {
  const navigate = useNavigate();

  return (
    <article className="card-hover group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-52 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">
            {item.audience}
          </span>
          <span className="text-xs font-medium text-gray-400">•</span>
          <span className="text-xs font-medium text-gray-500">{item.duration}</span>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h2>
        <p className="mb-5 text-sm leading-relaxed text-gray-500">{item.description}</p>
        <div className="mb-4">
          <span className="text-2xl font-bold text-brand-600">
            {item.price.toLocaleString("vi-VN")}
          </span>
          <span className="ml-1 text-xs text-gray-400">VNĐ/khóa</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Thêm giỏ hàng
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-pink-100 text-pink-500 transition-colors hover:bg-pink-50"
            aria-label="Xóa yêu thích"
          >
            <Heart className="h-4 w-4 fill-pink-500" />
          </button>
          <button
            type="button"
            onClick={() => navigate(`/course/${item.id}`)}
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

