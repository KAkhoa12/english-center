from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.commerce import Cart, CartItem, CourseWishlist
from app.repositories.base import BaseRepository


class CartRepository(BaseRepository[Cart]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Cart)

    def get_active_by_user_id(self, user_id: str) -> Cart | None:
        return self.db.execute(
            select(Cart).where(Cart.user_id == user_id, Cart.deleted_at.is_(None))
        ).scalar_one_or_none()


class CartItemRepository(BaseRepository[CartItem]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CartItem)

    def list_by_cart_id(self, cart_id: str) -> list[CartItem]:
        return list(
            self.db.execute(
                select(CartItem).where(CartItem.cart_id == cart_id, CartItem.deleted_at.is_(None))
            ).scalars().all()
        )

    def get_by_cart_and_course(self, cart_id: str, course_id: str) -> CartItem | None:
        return self.db.execute(
            select(CartItem).where(
                CartItem.cart_id == cart_id,
                CartItem.course_id == course_id,
                CartItem.deleted_at.is_(None),
            )
        ).scalar_one_or_none()


class CourseWishlistRepository(BaseRepository[CourseWishlist]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseWishlist)

    def list_by_user_id(self, user_id: str) -> list[CourseWishlist]:
        return list(
            self.db.execute(
                select(CourseWishlist).where(CourseWishlist.user_id == user_id, CourseWishlist.deleted_at.is_(None))
            ).scalars().all()
        )

    def get_by_user_and_course(self, user_id: str, course_id: str) -> CourseWishlist | None:
        return self.db.execute(
            select(CourseWishlist).where(
                CourseWishlist.user_id == user_id,
                CourseWishlist.course_id == course_id,
                CourseWishlist.deleted_at.is_(None),
            )
        ).scalar_one_or_none()
