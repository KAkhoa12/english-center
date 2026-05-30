
export type CartItemClassRef = {
  id: string;
  name: string;
  code: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
};

export type CartItem = {
  id: string;
  course_id: string;
  class_id: string | null;
  class: CartItemClassRef | null;
  course_name: string;
  course_code: string;
  unit_price: number;
  quantity: number;
  total_price: number;
};

export type Cart = {
  id: string;
  user_id: string;
  status: string;
  items: CartItem[];
  subtotal_amount: number;
  total_items: number;
};

export type AddCartItemRequest = {
  course_id: string;
  class_id?: string | null;
};

export type UpdateCartItemRequest = {
  quantity: number;
};
