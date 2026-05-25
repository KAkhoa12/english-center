import { useNavigate } from "react-router-dom";

type CartSummaryProps = {
  subtotal: number;
  discount: number;
};

export default function CartSummary({ subtotal, discount }: CartSummaryProps) {
  const navigate = useNavigate();
  const total = subtotal - discount;

  return (
    <aside className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Tóm tắt đơn hàng</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Ưu đãi</span>
          <span>-{discount.toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div className="border-t border-gray-100 pt-3 text-base font-semibold text-gray-900">
          <div className="flex items-center justify-between">
            <span>Tổng cộng</span>
            <span className="text-brand-600">{total.toLocaleString("vi-VN")} VNĐ</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/payment")}
        className="mt-6 w-full rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600"
      >
        Tiến hành thanh toán
      </button>
    </aside>
  );
}

