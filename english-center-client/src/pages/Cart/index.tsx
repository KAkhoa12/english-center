import { useMemo, useState } from "react";

import CartHeader from "@/components/Cart/CartHeader";
import CartItemCard, { type CartItem } from "@/components/Cart/CartItemCard";
import CartSummary from "@/components/Cart/CartSummary";
import EmptyCart from "@/components/Cart/EmptyCart";

const initialCartItems: CartItem[] = [
  {
    id: "ielts-prep",
    title: "Luyện Thi IELTS",
    audience: "18+ tuổi",
    duration: "60 buổi",
    price: 8500000,
    image: "https://picsum.photos/seed/cart-ielts/600/400.jpg",
  },
  {
    id: "business-english",
    title: "Tiếng Anh Thương Mại",
    audience: "Doanh nghiệp",
    duration: "48 buổi",
    price: 7800000,
    image: "https://picsum.photos/seed/cart-business/600/400.jpg",
  },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items],
  );
  const discount = useMemo(() => Math.round(subtotal * 0.1), [subtotal]);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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
            <CartSummary subtotal={subtotal} discount={discount} />
          </div>
        )}
      </div>
    </section>
  );
}
