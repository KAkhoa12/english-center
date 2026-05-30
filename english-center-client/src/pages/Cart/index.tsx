import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import CartHeader from "@/components/Cart/CartHeader";
import CartItemCard, { type CartItem } from "@/components/Cart/CartItemCard";
import CartSummary from "@/components/Cart/CartSummary";
import EmptyCart from "@/components/Cart/EmptyCart";
import { useCartStore } from "@/services/cart/cart.store";

export default function CartPage() {
  const { cart, getCart, deleteCartItem, isLoading } = useCartStore();
  const items = useMemo<CartItem[]>(
    () =>
      (cart?.items || []).map((item) => ({
        id: item.id,
        cartItemId: item.id,
        title: item.course_name,
        courseCode: item.course_code,
        classId: item.class_id,
        className: item.class?.name ?? null,
        classCode: item.class?.code ?? null,
        classStartDate: item.class?.start_date ?? null,
        quantity: item.quantity,
        price: item.total_price,
      })),
    [cart?.items],
  );
  const subtotal = cart?.subtotal_amount ?? 0;
  const total = subtotal;

  useEffect(() => {
    void getCart().catch(() => {
      toast.error("Không thể tải giỏ hàng");
    });
  }, [getCart]);

  const handleRemove = async (cartItemId: string) => {
    try {
      await deleteCartItem(cartItemId);
      toast.success("Xóa khóa học khỏi giỏ hàng thành công");
    } catch {
      toast.error("Xóa khóa học khỏi giỏ hàng thất bại");
    }
  };

  return (
    <section className="bg-gray-50 pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <CartHeader itemCount={items.length} />

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </div>
            <CartSummary subtotal={subtotal} total={total} />
          </div>
        )}
        {isLoading ? (
          <p className="mt-4 text-sm text-gray-500">Đang tải giỏ hàng...</p>
        ) : null}
      </div>
    </section>
  );
}
