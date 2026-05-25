import { Trash2 } from "lucide-react";

export type CartItem = {
  id: string;
  title: string;
  audience: string;
  duration: string;
  price: number;
  image: string;
};

type CartItemCardProps = {
  item: CartItem;
  onRemove: (id: string) => void;
};

export default function CartItemCard({ item, onRemove }: CartItemCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <img
          src={item.image}
          alt={item.title}
          className="h-44 w-full object-cover sm:h-auto sm:w-48"
        />
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">
                {item.audience}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-medium text-gray-500">{item.duration}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xl font-bold text-brand-600">
              {item.price.toLocaleString("vi-VN")}{" "}
              <span className="text-xs font-normal text-gray-400">VNĐ</span>
            </p>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="inline-flex items-center gap-1 rounded-full border border-red-100 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Xóa
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

