type FavoritesHeaderProps = {
  itemCount: number;
};

export default function FavoritesHeader({ itemCount }: FavoritesHeaderProps) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">
        Yêu thích
      </p>
      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        Danh sách khóa học quan tâm
      </h1>
      <p className="mt-3 text-sm text-gray-500 sm:text-base">
        Bạn đang lưu {itemCount} khóa học để xem lại và đăng ký sau.
      </p>
    </div>
  );
}

