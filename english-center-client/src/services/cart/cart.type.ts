
export type CartItem = {
  id: string;
  course_id: string;
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
};

export type UpdateCartItemRequest = {
  quantity: number;
};
