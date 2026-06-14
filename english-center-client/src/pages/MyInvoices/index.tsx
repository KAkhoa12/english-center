import { CreditCard, FileText, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useInvoicesStore } from "@/services/invoices/invoices.store";

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Đã thanh toán", className: "bg-accent-50 text-accent-600" },
  pending: { label: "Chờ thanh toán", className: "bg-amber-50 text-amber-600" },
  cancelled: { label: "Đã hủy", className: "bg-red-50 text-red-600" },
  overdue: { label: "Quá hạn", className: "bg-red-50 text-red-600" },
};

export default function MyInvoicesPage() {
  const navigate = useNavigate();
  const { invoices, isLoading, myInvoices } = useInvoicesStore();

  useEffect(() => {
    void myInvoices().catch(() => {
      toast.error("Không thể tải danh sách hóa đơn");
    });
  }, [myInvoices]);

  return (
    <section className="bg-gray-50 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">
            Hóa đơn của tôi
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Lịch sử thanh toán
          </h1>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            Xem lại các hóa đơn và trạng thái thanh toán của bạn.
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
              <FileText className="h-6 w-6 text-brand-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Chưa có hóa đơn nào</h2>
            <p className="mt-2 text-sm text-gray-500">
              Bạn chưa có hóa đơn thanh toán nào. Hãy đăng ký khóa học để bắt đầu.
            </p>
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="mt-5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Khám phá khóa học
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => {
              const status = statusConfig[invoice.invoice_status] ?? {
                label: invoice.invoice_status,
                className: "bg-gray-100 text-gray-600",
              };

              return (
                <article
                  key={invoice.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">
                          {invoice.invoice_number}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-2 grid gap-1 text-sm text-gray-500 sm:grid-cols-2">
                        {invoice.buyer_name ? (
                          <p>Người mua: <span className="font-medium text-gray-700">{invoice.buyer_name}</span></p>
                        ) : null}
                        {invoice.issued_at ? (
                          <p>Ngày phát hành: <span className="font-medium text-gray-700">{new Date(invoice.issued_at).toLocaleDateString("vi-VN")}</span></p>
                        ) : null}
                        {invoice.paid_at ? (
                          <p>Ngày thanh toán: <span className="font-medium text-gray-700">{new Date(invoice.paid_at).toLocaleDateString("vi-VN")}</span></p>
                        ) : null}
                      </div>

                      {invoice.items.length > 0 ? (
                        <div className="mt-3 space-y-1">
                          {invoice.items.map((item) => (
                            <p key={item.id} className="text-xs text-gray-400">
                              {item.item_name} ({item.item_code}) x{item.quantity} — {item.total_price.toLocaleString("vi-VN")} VNĐ
                            </p>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Tổng cộng</p>
                        <p className="text-xl font-bold text-brand-600">
                          {invoice.total_amount.toLocaleString("vi-VN")}
                          <span className="ml-1 text-xs font-normal text-gray-400">VNĐ</span>
                        </p>
                      </div>
                      {invoice.invoice_status !== "paid" ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/payment?order_id=${invoice.order_id}`)}
                          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                        >
                          <CreditCard className="h-4 w-4" />
                          Thanh toán
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate(`/payment?order_id=${invoice.order_id}`)}
                          className="inline-flex items-center gap-2 rounded-full border border-accent-100 bg-accent-50 px-4 py-2 text-sm font-medium text-accent-600 transition-colors hover:bg-accent-100"
                        >
                          <FileText className="h-4 w-4" />
                          Xem chi tiết
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
