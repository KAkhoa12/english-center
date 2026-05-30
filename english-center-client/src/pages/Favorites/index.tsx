import { useEffect } from "react";
import { toast } from "sonner";

import EmptyFavorites from "@/components/Favorites/EmptyFavorites";
import FavoriteCourseCard from "@/components/Favorites/FavoriteCourseCard";
import FavoritesHeader from "@/components/Favorites/FavoritesHeader";
import { useWishlistStore } from "@/services/wishlist/wishlist.store";

export default function FavoritesPage() {
  const { wishlist, isLoading, getWishlist, removeWishlist } = useWishlistStore();

  useEffect(() => {
    void getWishlist().catch(() => {
      toast.error("Không thể tải danh sách yêu thích");
    });
  }, [getWishlist]);

  const handleRemove = async (courseId: string) => {
    try {
      await removeWishlist(courseId);
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } catch {
      toast.error("Xóa khỏi yêu thích thất bại");
    }
  };

  return (
    <section className="bg-gray-50 pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FavoritesHeader itemCount={wishlist.length} />
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
          </div>
        ) : wishlist.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <FavoriteCourseCard key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
