import { useState } from "react";

import EmptyFavorites from "@/components/Favorites/EmptyFavorites";
import FavoriteCourseCard, {
  type FavoriteCourse,
} from "@/components/Favorites/FavoriteCourseCard";
import FavoritesHeader from "@/components/Favorites/FavoritesHeader";

const initialFavorites: FavoriteCourse[] = [
  {
    id: "kids-english",
    title: "Tiếng Anh Trẻ Em",
    audience: "4-11 tuổi",
    duration: "36 buổi",
    price: 3500000,
    image: "https://picsum.photos/seed/fav-kids/600/400.jpg",
    description:
      "Phương pháp học qua trò chơi và tương tác trực quan, phù hợp trẻ mới bắt đầu.",
  },
  {
    id: "toeic-prep",
    title: "Luyện Thi TOEIC",
    audience: "Sinh viên",
    duration: "48 buổi",
    price: 6200000,
    image: "https://picsum.photos/seed/fav-toeic/600/400.jpg",
    description:
      "Tăng tốc Listening và Reading, luyện đề bám sát format thi thực tế.",
  },
  {
    id: "conversation",
    title: "Giao Tiếp Ứng Dụng",
    audience: "Người lớn",
    duration: "36 buổi",
    price: 5200000,
    image: "https://picsum.photos/seed/fav-conversation/600/400.jpg",
    description:
      "Rèn phản xạ giao tiếp trong môi trường công việc và đời sống hằng ngày.",
  },
];

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteCourse[]>(initialFavorites);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className="bg-gray-50 pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FavoritesHeader itemCount={items.length} />
        {items.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <FavoriteCourseCard key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
