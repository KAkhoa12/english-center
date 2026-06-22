
export type WishlistCourse = {
  id: string;
  name: string;
  code: string;
  slug: string;
  description: string | null;
  target_level: string | null;
  total_sessions: number | null;
  price: number;
  status: string;
  thumbnail_url: string | null;
};

export type WishlistItem = {
  id: string;
  course_id: string;
  course: WishlistCourse;
  created_at: string;
};

export type WishlistCreateRequest = {
  course_id: string;
};

export type ListWishlistQuery = {
  page?: number;
  page_size?: number;
};
