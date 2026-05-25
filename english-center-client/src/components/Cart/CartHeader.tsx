type CartHeaderProps = {
  itemCount: number;
};

export default function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">
        Giỏ hàng
      </p>
      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        Khóa học bạn đã chọn
      </h1>
      <p className="mt-3 text-sm text-gray-500 sm:text-base">
        Bạn đang có {itemCount} khóa học trong giỏ. Kiểm tra thông tin trước khi
        thanh toán.
      </p>
    </div>
  );
}

