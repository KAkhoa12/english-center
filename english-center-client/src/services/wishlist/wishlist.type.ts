
export type WishlistCourse = Record<string, unknown>;

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
