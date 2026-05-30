import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  ReceiptText,
  ShoppingBag,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/services/auth/auth.store";
import type { CartItem } from "@/services/cart/cart.type";
import { useCartStore } from "@/services/cart/cart.store";
import { useOrdersStore } from "@/services/orders/orders.store";
import type { Order, OrderItem } from "@/services/orders/orders.type";
import { usePaymentsStore } from "@/services/payments/payments.store";

const isFastPayAvailable = import.meta.env.MODE !== "production";

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")} VNĐ`;

const formatDate = (value?: string | null) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString("vi-VN");
};

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Đã thanh toán", className: "bg-accent-50 text-accent-600" },
  pending: { label: "Chờ thanh toán", className: "bg-amber-50 text-amber-600" },
  cancelled: { label: "Đã hủy", className: "bg-red-50 text-red-600" },
  overdue: { label: "Quá hạn", className: "bg-red-50 text-red-600" },
  approved: { label: "Đã duyệt", className: "bg-accent-50 text-accent-600" },
  processing: { label: "Đang xử lý", className: "bg-blue-50 text-blue-600" },
};

type PaymentLineItem = {
  id: string;
  name: string;
  code: string;
  className: string | null;
  classCode: string | null;
  classStartDate: string | null;
  quantity: number;
  totalPrice: number;
};

const cartItemToLineItem = (item: CartItem): PaymentLineItem => ({
  id: item.id,
  name: item.course_name,
  code: item.course_code,
  className: item.class?.name ?? null,
  classCode: item.class?.code ?? null,
  classStartDate: item.class?.start_date ?? null,
  quantity: item.quantity,
  totalPrice: item.total_price,
});

const orderItemToLineItem = (item: OrderItem): PaymentLineItem => ({
  id: item.id,
  name: item.course_name,
  code: item.course_code,
  className: item.class?.name ?? null,
  classCode: item.class?.code ?? null,
  classStartDate: item.class?.start_date ?? null,
  quantity: item.quantity,
  totalPrice: item.total_price,
});

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const invoiceNumber = searchParams.get("invoice_number");
  const isExistingOrderMode = Boolean(orderId || invoiceNumber);

  const { cart, getCart } = useCartStore();
  const {
    checkout,
    getOrder,
    getOrderByInvoice,
    selectedOrder,
    clearSelectedOrder,
    isLoading,
  } = useOrdersStore();
  const { markOrderPaid } = usePaymentsStore();
  const { me } = useAuthStore();

  const [form, setForm] = useState({
    buyer_name: me?.user?.full_name || "",
    buyer_email: me?.user?.email || "",
    buyer_phone: "",
    note: "",
  });
  const [useFastPay, setUseFastPay] = useState(isFastPayAvailable);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  useEffect(() => {
    if (isExistingOrderMode) return;

    void getCart().catch(() => {
      toast.error("Không thể tải giỏ hàng");
    });
  }, [getCart, isExistingOrderMode]);

  useEffect(() => {
    if (!isExistingOrderMode) return;

    const loadOrder = async () => {
      if (orderId) {
        await getOrder(orderId);
        return;
      }

      if (invoiceNumber) {
        const order = await getOrderByInvoice(invoiceNumber);
        if (!order) throw new Error("Không tìm thấy hóa đơn");
      }
    };

    void loadOrder().catch((error) => {
      toast.error(error instanceof Error ? error.message : "Không thể tải thông tin thanh toán");
    });

    return () => {
      clearSelectedOrder();
    };
  }, [clearSelectedOrder, getOrder, getOrderByInvoice, invoiceNumber, isExistingOrderMode, orderId]);

  const cartItems = cart?.items ?? [];
  const orderItems = selectedOrder?.items ?? [];
  const items = useMemo(
    () =>
      isExistingOrderMode
        ? orderItems.map(orderItemToLineItem)
        : cartItems.map(cartItemToLineItem),
    [cartItems, isExistingOrderMode, orderItems],
  );
  const subtotal = isExistingOrderMode
    ? selectedOrder?.subtotal_amount ?? 0
    : cart?.subtotal_amount ?? 0;
  const discount = isExistingOrderMode ? selectedOrder?.discount_amount ?? 0 : 0;
  const total = isExistingOrderMode ? selectedOrder?.total_amount ?? 0 : subtotal;
  const invoiceStatus = selectedOrder?.invoice?.invoice_status ?? selectedOrder?.status ?? "pending";
  const isPaid = selectedOrder?.status === "paid" || selectedOrder?.invoice?.invoice_status === "paid";
  const invoiceBadge = statusConfig[invoiceStatus] ?? {
    label: invoiceStatus,
    className: "bg-gray-100 text-gray-600",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMarkPaid = async (order: Order) => {
    if (!isFastPayAvailable) {
      toast.error("Thanh toán nhanh chỉ dùng cho môi trường test");
      return;
    }

    try {
      setIsMarkingPaid(true);
      await markOrderPaid(order.id, {
        payment_method: "MANUAL_BANK_TRANSFER",
        reference: `TEST_${order.order_code}`,
      });
      await getOrder(order.id);
      toast.success(`Thanh toán test thành công! Mã đơn: ${order.order_code}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Xác nhận thanh toán thất bại");
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isExistingOrderMode) {
      if (!selectedOrder) return;
      await handleMarkPaid(selectedOrder);
      return;
    }

    if (!form.buyer_name.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }
    if (!form.buyer_email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống, không thể đặt hàng");
      return;
    }

    try {
      const order = await checkout({
        buyer_name: form.buyer_name.trim(),
        buyer_email: form.buyer_email.trim(),
        buyer_phone: form.buyer_phone.trim() || null,
        note: form.note.trim() || null,
      });
      if (useFastPay && isFastPayAvailable) {
        setIsMarkingPaid(true);
        await markOrderPaid(order.id, {
          payment_method: "MANUAL_BANK_TRANSFER",
          reference: `TEST_${order.order_code}`,
        });
        toast.success(`Thanh toán test thành công! Mã đơn: ${order.order_code}`);
        void navigate("/my-courses");
        return;
      }

      toast.success(`Đặt hàng thành công! Mã đơn: ${order.order_code}`);
      void navigate(`/payment?order_id=${order.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đặt hàng thất bại");
    } finally {
      setIsMarkingPaid(false);
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <section className="bg-gray-50 pb-24 pt-32">
        <div className="mx-auto flex h-80 max-w-7xl items-center justify-center px-6 lg:px-8">
          <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
        </div>
      </section>
    );
  }

  if (isExistingOrderMode && !isLoading && !selectedOrder) {
    return (
      <section className="bg-gray-50 pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <FileText className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Không tìm thấy hóa đơn</h2>
            <p className="mt-2 text-sm text-gray-500">
              Vui lòng kiểm tra lại mã đơn hàng hoặc mã hóa đơn.
            </p>
            <button
              type="button"
              onClick={() => navigate("/my-invoices")}
              className="mt-5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Xem hóa đơn của tôi
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!isExistingOrderMode && cartItems.length === 0 && !isLoading) {
    return (
      <section className="bg-gray-50 pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
              <ShoppingBag className="h-6 w-6 text-brand-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Giỏ hàng trống</h2>
            <p className="mt-2 text-sm text-gray-500">
              Hãy thêm khóa học vào giỏ hàng trước khi thanh toán.
            </p>
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="mt-5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Khám phá khóa học
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(isExistingOrderMode ? "/my-invoices" : "/cart")}
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-brand-500"
          >
            <ArrowLeft className="h-4 w-4" />
            {isExistingOrderMode ? "Quay lại hóa đơn" : "Quay lại giỏ hàng"}
          </button>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">
            Thanh toán
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {isExistingOrderMode ? "Thanh toán hóa đơn" : "Hoàn tất đơn hàng"}
          </h1>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            {isExistingOrderMode
              ? "Kiểm tra hóa đơn, trạng thái thanh toán và xác nhận thanh toán test nếu cần."
              : "Kiểm tra thông tin và xác nhận đặt hàng."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {isExistingOrderMode && selectedOrder ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <ReceiptText className="h-5 w-5 text-brand-500" />
                    Thông tin hóa đơn
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-400">Mã đơn hàng</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedOrder.order_code}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-400">Số hóa đơn</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedOrder.invoice?.invoice_number || selectedOrder.invoice_number}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-400">Trạng thái hóa đơn</p>
                      <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${invoiceBadge.className}`}>
                        {invoiceBadge.label}
                      </span>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-400">Phương thức thanh toán</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedOrder.payment_method || "Chưa xác định"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <User className="h-5 w-5 text-brand-500" />
                    Thông tin người mua
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="buyer_name" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="buyer_name"
                        name="buyer_name"
                        type="text"
                        value={form.buyer_name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      />
                    </div>
                    <div>
                      <label htmlFor="buyer_email" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="buyer_email"
                        name="buyer_email"
                        type="email"
                        value={form.buyer_email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="buyer_phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Số điện thoại
                      </label>
                      <input
                        id="buyer_phone"
                        name="buyer_phone"
                        type="tel"
                        value={form.buyer_phone}
                        onChange={handleChange}
                        placeholder="0912 345 678"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                      />
                    </div>
                  </div>
                </div>
              )}

              {!isExistingOrderMode ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <MapPin className="h-5 w-5 text-brand-500" />
                    Ghi chú đơn hàng
                  </h2>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                  />
                </div>
              ) : null}

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <CreditCard className="h-5 w-5 text-brand-500" />
                  Phương thức thanh toán
                </h2>
                {isFastPayAvailable ? (
                  isExistingOrderMode ? (
                    <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
                      <p className="text-sm font-semibold text-gray-900">
                        Thanh toán nhanh cho môi trường test
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        Nút thanh toán sẽ gọi API mark-paid cho hóa đơn hiện tại. Khi thành công,
                        order, invoice, payment và enrollment sẽ được đồng bộ trạng thái paid.
                      </p>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4">
                      <input
                        type="checkbox"
                        checked={useFastPay}
                        onChange={(event) => setUseFastPay(event.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-gray-900">
                          Thanh toán nhanh cho môi trường test
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-gray-600">
                          Sau khi tạo đơn hàng, hệ thống tự đánh dấu đơn đã thanh toán và mở khóa khóa học.
                        </span>
                      </span>
                    </label>
                  )
                ) : (
                  <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    Đơn hàng sẽ chờ thanh toán qua phương thức được cấu hình trên hệ thống.
                  </div>
                )}
              </div>

              {isExistingOrderMode && selectedOrder?.payments?.length ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <FileText className="h-5 w-5 text-brand-500" />
                    Giao dịch thanh toán
                  </h2>
                  <div className="space-y-3">
                    {selectedOrder.payments.map((payment) => {
                      const paymentStatus = statusConfig[payment.status] ?? {
                        label: payment.status,
                        className: "bg-gray-100 text-gray-600",
                      };

                      return (
                        <div key={payment.id} className="rounded-xl bg-gray-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-900">
                              {payment.payment_method || payment.provider}
                            </p>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatus.className}`}>
                              {paymentStatus.label}
                            </span>
                          </div>
                          <div className="mt-2 grid gap-1 text-xs text-gray-500 sm:grid-cols-2">
                            <p>Số tiền: {formatCurrency(payment.amount)}</p>
                            <p>Mã giao dịch: {payment.provider_transaction_id || "Chưa có"}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <CreditCard className="h-5 w-5 text-brand-500" />
                  {isExistingOrderMode ? "Chi tiết hóa đơn" : "Đơn hàng của bạn"}
                </h3>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">{item.code}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.className ? `Lớp: ${item.className}` : "Khóa tự học"}
                        </p>
                        {item.className ? (
                          <p className="mt-0.5 text-xs text-gray-400">
                            {item.classCode || "Chưa có mã lớp"}
                            {item.classStartDate
                              ? ` · ${formatDate(item.classStartDate)}`
                              : ""}
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-gray-700">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Tạm tính ({items.length} khóa học)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Giảm giá</span>
                    <span>{formatCurrency(discount)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 text-base font-semibold">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">Tổng cộng</span>
                      <span className="text-brand-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    isMarkingPaid ||
                    items.length === 0 ||
                    (isExistingOrderMode && (isPaid || !selectedOrder || !isFastPayAvailable))
                  }
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : isMarkingPaid ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang xác nhận thanh toán...
                    </>
                  ) : isExistingOrderMode && isPaid ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Hóa đơn đã thanh toán
                    </>
                  ) : isExistingOrderMode ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Xác nhận thanh toán test
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Xác nhận đặt hàng
                    </>
                  )}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </section>
  );
}
