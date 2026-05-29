export type CashflowType = "income" | "expense";

export type CashflowItem = {
  id: string;
  title: string;
  type: CashflowType;
  amount: number;
  note: string;
  transaction_date: string;
};

export type CashflowPayload = Omit<CashflowItem, "id">;

let cashflows: CashflowItem[] = [
  {
    id: "cf-1",
    title: "Thu hoc phi thang 5",
    type: "income",
    amount: 15000000,
    note: "Thu hoc phi lop IELTS",
    transaction_date: "2026-05-20",
  },
  {
    id: "cf-2",
    title: "Chi van hanh",
    type: "expense",
    amount: 3500000,
    note: "Tien dien nuoc va internet",
    transaction_date: "2026-05-22",
  },
];

const delay = async () => new Promise((resolve) => setTimeout(resolve, 150));

export const cashflowMockStore = {
  async list(search?: string) {
    await delay();
    if (!search?.trim()) return [...cashflows];
    const keyword = search.trim().toLowerCase();
    return cashflows.filter((item) =>
      [item.title, item.note].join(" ").toLowerCase().includes(keyword)
    );
  },

  async getById(id: string) {
    await delay();
    return cashflows.find((item) => item.id === id) ?? null;
  },

  async create(payload: CashflowPayload) {
    await delay();
    const created: CashflowItem = { ...payload, id: `cf-${Date.now()}` };
    cashflows = [created, ...cashflows];
    return created;
  },

  async update(id: string, payload: CashflowPayload) {
    await delay();
    cashflows = cashflows.map((item) => (item.id === id ? { ...item, ...payload } : item));
    return cashflows.find((item) => item.id === id) ?? null;
  },
};
