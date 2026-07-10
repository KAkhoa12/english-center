from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.class_model import ClassStatus, CourseClass
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.models.commerce import (
    Cart,
    CartItem,
    CartStatus,
    CourseEnrollment,
    CourseWishlist,
    EnrollmentStatus,
    Invoice,
    InvoiceItem,
    InvoiceStatus,
    Order,
    OrderItem,
    OrderPaymentMethod,
    OrderStatus,
    Payment,
    PaymentMethod,
    PaymentProvider,
    PaymentStatus,
    PaymentWebhookLog,
)
from app.models.course import CourseMode, CourseStatus
from app.models import User
from app.repositories.cart import CartItemRepository, CartRepository, CourseWishlistRepository
from app.repositories.course import CourseRepository
from app.repositories.course_class import CourseClassRepository
from app.repositories.course_enrollment import CourseEnrollmentRepository
from app.repositories.invoice import InvoiceItemRepository, InvoiceRepository
from app.repositories.order import OrderItemRepository, OrderRepository
from app.repositories.payment import PaymentRepository, PaymentWebhookLogRepository
from app.repositories.student import StudentRepository
from app.repositories.class_student import ClassStudentRepository
from app.schemas.commerce import CheckoutRequest
from app.schemas.common import PaginationParams
from app.services.course_service import CourseService
from app.services.rbac_service import RBACService
from app.services.sepay_service import SePayService


def now() -> datetime:
    return datetime.now(timezone.utc)


def money(value: Any) -> float:
    return float(value or 0)


def parse_enum(enum_class: type, value: str, field_name: str) -> Any:
    try:
        return enum_class(value)
    except ValueError as exc:
        try:
            return enum_class[value]
        except Exception as inner_exc:
            lowered = value.strip().lower()
            for member in enum_class:
                if getattr(member, "value", None) == lowered or member.name.lower() == lowered:
                    return member
            raise HTTPException(status_code=400, detail=f"Invalid {field_name}") from inner_exc


class AccessMixin:
    def __init__(self, db: Session) -> None:
        self.db = db

    def can_access_all(self, user: User, permission: str) -> bool:
        rbac = RBACService(self.db)
        permissions = rbac.get_user_permissions(str(user.id))
        return "admin.all" in permissions or permission in permissions


class CartService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.cart_repo = CartRepository(db)
        self.cart_item_repo = CartItemRepository(db)
        self.course_repo = CourseRepository(db)
        self.class_repo = CourseClassRepository(db)
        self.class_student_repo = ClassStudentRepository(db)
        self.student_repo = StudentRepository(db)

    def _validate_class_selection(
        self,
        user_id: str,
        course,
        class_id: str | None,
    ) -> CourseClass | None:
        if course.mode == CourseMode.template:
            if class_id:
                raise HTTPException(status_code=400, detail="Template course does not require class_id")
            return None

        if not class_id:
            raise HTTPException(status_code=400, detail="class_id is required for center course")

        class_obj = self.class_repo.get_active_by_id(class_id)
        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")
        if str(class_obj.course_id) != str(course.id):
            raise HTTPException(status_code=400, detail="Class does not belong to course")
        if class_obj.status in {ClassStatus.cancelled, ClassStatus.completed, ClassStatus.archived}:
            raise HTTPException(status_code=400, detail="Class is not available for enrollment")
        if self.class_student_repo.count_active_students(str(class_obj.id)) >= class_obj.max_students:
            raise HTTPException(status_code=400, detail="Class is full")

        student = self.student_repo.get_by_user_id(user_id)
        if not student:
            raise HTTPException(status_code=400, detail="Student profile is required for center course enrollment")
        class_student = self.class_student_repo.get_by_class_and_student(str(class_obj.id), str(student.id))
        if class_student and class_student.enrollment_status not in {ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped}:
            raise HTTPException(status_code=400, detail="Student already enrolled in class")
        return class_obj

    def get_or_create_active_cart(self, user_id: str) -> Cart:
        cart = self.cart_repo.get_active_by_user_id(user_id)
        if cart:
            return cart
        cart = Cart(user_id=user_id, status=CartStatus.active)
        self.cart_repo.create(cart)
        self.db.commit()
        return cart

    def get_items(self, cart_id: str) -> list[CartItem]:
        return self.cart_item_repo.list_by_cart_id(cart_id)

    def _class_ref(self, class_id: str | None) -> dict[str, Any] | None:
        if not class_id:
            return None
        class_obj = self.class_repo.get_active_by_id(str(class_id))
        if not class_obj:
            return None
        return {
            "id": str(class_obj.id),
            "name": class_obj.name,
            "code": class_obj.code,
            "start_date": class_obj.start_date,
            "status": class_obj.status.value,
        }

    def cart_dict(self, cart: Cart) -> dict[str, Any]:
        items = self.get_items(str(cart.id))
        subtotal = sum(item.total_price for item in items)
        return {
            "id": str(cart.id),
            "user_id": str(cart.user_id),
            "status": cart.status.value,
            "items": [
                {
                    "id": str(item.id),
                    "course_id": str(item.course_id),
                    "class_id": str(item.class_id) if item.class_id else None,
                    "class": self._class_ref(str(item.class_id) if item.class_id else None),
                    "course_name": item.course_name,
                    "course_code": item.course_code,
                    "unit_price": money(item.unit_price),
                    "quantity": item.quantity,
                    "total_price": money(item.total_price),
                }
                for item in items
            ],
            "subtotal_amount": money(subtotal),
            "total_items": len(items),
        }

    def add_course_to_cart(self, user_id: str, course_id: str, class_id: str | None = None) -> Cart:
        cart = self.get_or_create_active_cart(user_id)
        course = self.course_repo.get(course_id)
        if course and course.status != CourseStatus.active:
            course = None
        if not course:
            raise HTTPException(status_code=404, detail="Active course not found")
        class_obj = self._validate_class_selection(user_id, course, class_id)
        exists = self.cart_item_repo.get_by_cart_and_course(str(cart.id), str(course.id))
        if exists and exists.deleted_at is None:
            raise HTTPException(status_code=400, detail="Course already exists in cart")
        if exists:
            exists.deleted_at = None
            exists.class_id = class_obj.id if class_obj else None
            exists.course_name = course.name
            exists.course_code = course.code
            exists.unit_price = course.price
            exists.quantity = 1
            exists.total_price = course.price
        else:
            self.cart_item_repo.create(
                CartItem(
                cart_id=cart.id,
                course_id=course.id,
                class_id=class_obj.id if class_obj else None,
                course_name=course.name,
                course_code=course.code,
                unit_price=course.price,
                quantity=1,
                total_price=course.price,
                )
            )
        self.db.commit()
        return cart

    def update_cart_item(self, user_id: str, cart_item_id: str, quantity: int) -> Cart:
        if quantity != 1:
            raise HTTPException(status_code=400, detail="Course quantity must be 1")
        cart = self.get_or_create_active_cart(user_id)
        item = self.cart_item_repo.get_active_by_id_and_cart(cart_item_id, str(cart.id))
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        item.quantity = quantity
        item.total_price = item.unit_price * quantity
        self.db.commit()
        return cart

    def remove_cart_item(self, user_id: str, cart_item_id: str) -> Cart:
        cart = self.get_or_create_active_cart(user_id)
        item = self.cart_item_repo.get_active_by_id_and_cart(cart_item_id, str(cart.id))
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        item.deleted_at = now()
        self.db.commit()
        return cart

    def clear_cart(self, user_id: str) -> Cart:
        cart = self.get_or_create_active_cart(user_id)
        for item in self.get_items(str(cart.id)):
            item.deleted_at = now()
        self.db.commit()
        return cart


class WishlistService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.wishlist_repo = CourseWishlistRepository(db)
        self.course_repo = CourseRepository(db)

    def _resolve_active_course(self, course_identifier: str):
        course = self.course_repo.get(course_identifier)
        if not course:
            course = self.course_repo.get_by_slug(course_identifier)
        if course and course.status != CourseStatus.active:
            course = None
        if not course:
            raise HTTPException(status_code=404, detail="Active course not found")
        return course

    def get_wishlist(self, user_id: str, query: PaginationParams) -> tuple[list[dict[str, Any]], int]:
        rows = self.wishlist_repo.list_with_course_by_user_id(user_id)
        total = len(rows)
        rows = rows[(query.page - 1) * query.page_size : query.page * query.page_size]
        return [
            {
                "id": str(wishlist.id),
                "course_id": str(course.id),
                "course": CourseService(self.db).course_list_dict(course),
                "created_at": wishlist.created_at,
            }
            for wishlist, course in rows
        ], int(total)

    def add_to_wishlist(self, user_id: str, course_id: str) -> CourseWishlist:
        course = self._resolve_active_course(course_id)
        item = self.wishlist_repo.get_by_user_and_course(user_id, str(course.id))
        if item and item.deleted_at is None:
            raise HTTPException(status_code=400, detail="Course already exists in wishlist")
        if item:
            item.deleted_at = None
        else:
            item = CourseWishlist(user_id=user_id, course_id=str(course.id))
            self.wishlist_repo.create(item)
        self.db.commit()
        return item

    def remove_from_wishlist(self, user_id: str, course_id: str) -> None:
        course = self._resolve_active_course(course_id)
        item = self.wishlist_repo.get_active_by_user_and_course(user_id, str(course.id))
        if not item:
            raise HTTPException(status_code=404, detail="Wishlist item not found")
        item.deleted_at = now()
        self.db.commit()

    def is_favorited(self, user_id: str, course_id: str) -> bool:
        course = self._resolve_active_course(course_id)
        return self.wishlist_repo.get_active_by_user_and_course(user_id, str(course.id)) is not None


class OrderSerializer:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.order_item_repo = OrderItemRepository(db)
        self.invoice_repo = InvoiceRepository(db)
        self.payment_repo = PaymentRepository(db)
        self.class_repo = CourseClassRepository(db)

    def order_items(self, order_id: str) -> list[OrderItem]:
        return self.order_item_repo.list_by_order_id(order_id)

    def invoice(self, order_id: str) -> Invoice | None:
        return self.invoice_repo.get_by_order_id(order_id)

    def payments(self, order_id: str) -> list[Payment]:
        return self.payment_repo.list_by_order_id(order_id)

    def class_ref(self, class_id: str | None) -> dict[str, Any] | None:
        if not class_id:
            return None
        class_obj = self.class_repo.get_active_by_id(str(class_id))
        if not class_obj:
            return None
        return {
            "id": str(class_obj.id),
            "name": class_obj.name,
            "code": class_obj.code,
            "start_date": class_obj.start_date,
            "status": class_obj.status.value,
        }

    def payment_dict(self, payment: Payment) -> dict[str, Any]:
        return {
            "id": str(payment.id),
            "order_id": str(payment.order_id),
            "provider": payment.provider.value,
            "payment_method": payment.payment_method.value,
            "status": payment.status.value,
            "amount": money(payment.amount),
            "currency": payment.currency,
            "checkout_url": payment.checkout_url,
            "external_order_id": payment.external_order_id,
            "external_transaction_id": payment.external_transaction_id,
            "provider_payment_id": payment.provider_payment_id,
            "provider_transaction_id": payment.provider_transaction_id,
            "paid_at": payment.paid_at,
            "failed_at": payment.failed_at,
            "cancelled_at": payment.cancelled_at,
        }

    def order_detail(self, order: Order) -> dict[str, Any]:
        invoice = self.invoice(str(order.id))
        return {
            "id": str(order.id),
            "user_id": str(order.user_id),
            "order_code": order.order_code,
            "invoice_number": invoice.invoice_number if invoice else None,
            "status": order.status.value,
            "currency": order.currency,
            "subtotal_amount": money(order.subtotal_amount),
            "discount_amount": money(order.discount_amount),
            "total_amount": money(order.total_amount),
            "items": [
                {
                    "id": str(item.id),
                    "course_id": str(item.course_id),
                    "class_id": str(item.class_id) if item.class_id else None,
                    "class": self.class_ref(str(item.class_id) if item.class_id else None),
                    "course_name": item.course_name,
                    "course_code": item.course_code,
                    "unit_price": money(item.unit_price),
                    "quantity": item.quantity,
                    "total_price": money(item.total_price),
                }
                for item in self.order_items(str(order.id))
            ],
            "invoice": {
                "id": str(invoice.id),
                "invoice_number": invoice.invoice_number,
                "invoice_status": invoice.invoice_status.value,
            }
            if invoice else None,
            "payments": [self.payment_dict(item) for item in self.payments(str(order.id))],
        }


class InvoiceService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.invoice_repo = InvoiceRepository(db)
        self.invoice_item_repo = InvoiceItemRepository(db)
        self.class_repo = CourseClassRepository(db)

    def _class_ref(self, class_id: str | None) -> dict[str, Any] | None:
        if not class_id:
            return None
        class_obj = self.class_repo.get_active_by_id(str(class_id))
        if not class_obj:
            return None
        return {
            "id": str(class_obj.id),
            "name": class_obj.name,
            "code": class_obj.code,
            "start_date": class_obj.start_date,
            "status": class_obj.status.value,
        }

    def invoice_detail(self, invoice: Invoice) -> dict[str, Any]:
        items = self.invoice_item_repo.list_by_invoice_id(str(invoice.id))
        return {
            "id": str(invoice.id),
            "order_id": str(invoice.order_id),
            "invoice_number": invoice.invoice_number,
            "invoice_status": invoice.invoice_status.value,
            "buyer_name": invoice.buyer_name,
            "buyer_email": invoice.buyer_email,
            "buyer_phone": invoice.buyer_phone,
            "currency": invoice.currency,
            "total_amount": money(invoice.total_amount),
            "items": [
                {
                    "id": str(item.id),
                    "course_id": str(item.course_id) if item.course_id else None,
                    "class_id": str(item.class_id) if item.class_id else None,
                    "class": self._class_ref(str(item.class_id) if item.class_id else None),
                    "item_name": item.item_name,
                    "item_code": item.item_code,
                    "unit_price": money(item.unit_price),
                    "quantity": item.quantity,
                    "total_price": money(item.total_price),
                }
                for item in items
            ],
            "issued_at": invoice.issued_at,
            "paid_at": invoice.paid_at,
        }

    def get_invoice(self, invoice_id: str) -> Invoice:
        invoice = self.invoice_repo.get(invoice_id)
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        return invoice

    def assert_invoice_access(self, invoice: Invoice, user: User) -> None:
        if str(invoice.user_id) == str(user.id):
            return
        if RBACService(self.db).has_permission(str(user.id), "invoice.all") or RBACService(self.db).has_permission(str(user.id), "admin.all"):
            return
        raise HTTPException(status_code=403, detail="Permission denied")

    def get_invoices(self, query: PaginationParams, user: User, status: str | None = None, user_id: str | None = None) -> tuple[list[Invoice], int]:
        can_all = RBACService(self.db).has_permission(str(user.id), "invoice.all") or RBACService(self.db).has_permission(str(user.id), "admin.all")
        filtered_user_id = None if can_all and not user_id else str(user_id or user.id)
        filtered_status = parse_enum(InvoiceStatus, status, "invoice status") if status else None
        items = self.invoice_repo.list_filtered(user_id=filtered_user_id, status=filtered_status)
        total = len(items)
        items = items[(query.page - 1) * query.page_size : query.page * query.page_size]
        return items, total

    def get_invoice_by_order(self, order_id: str, user: User) -> Invoice:
        order = OrderService(self.db).get_order(order_id)
        OrderService(self.db).assert_order_access(order, user)
        invoice = self.invoice_repo.get_by_order_id(str(order.id))
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        return invoice


class OrderService(AccessMixin):
    def __init__(self, db: Session) -> None:
        super().__init__(db)
        self.order_repo = OrderRepository(db)
        self.order_item_repo = OrderItemRepository(db)
        self.invoice_repo = InvoiceRepository(db)
        self.invoice_item_repo = InvoiceItemRepository(db)
        self.student_repo = StudentRepository(db)
        self.course_repo = CourseRepository(db)
        self.class_repo = CourseClassRepository(db)
        self.class_student_repo = ClassStudentRepository(db)

    def _validate_checkout_item(self, item: CartItem, student: Any | None) -> None:
        course = self.course_repo.get(str(item.course_id))
        if not course or course.status != CourseStatus.active:
            raise HTTPException(status_code=400, detail="Cart contains inactive or missing course")
        if course.mode == CourseMode.template:
            if item.class_id:
                raise HTTPException(status_code=400, detail="Template course does not require class_id")
            return

        if not item.class_id:
            raise HTTPException(status_code=400, detail="class_id is required for center course")
        class_obj = self.class_repo.get_active_by_id(str(item.class_id))
        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")
        if str(class_obj.course_id) != str(item.course_id):
            raise HTTPException(status_code=400, detail="Class does not belong to course")
        if class_obj.status in {ClassStatus.cancelled, ClassStatus.completed, ClassStatus.archived}:
            raise HTTPException(status_code=400, detail="Class is not available for enrollment")
        if self.class_student_repo.count_active_students(str(class_obj.id)) >= class_obj.max_students:
            raise HTTPException(status_code=400, detail="Class is full")
        if not student:
            raise HTTPException(status_code=400, detail="Student profile is required for center course enrollment")
        class_student = self.class_student_repo.get_by_class_and_student(str(class_obj.id), str(student.id))
        if class_student and class_student.enrollment_status not in {ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped}:
            raise HTTPException(status_code=400, detail="Student already enrolled in class")

    def _next_code(self, prefix: str) -> str:
        stamp = now().strftime("%Y%m%d")
        count = self.order_repo.count_created_since(now().replace(hour=0, minute=0, second=0, microsecond=0))
        return f"{prefix}{stamp}{int(count) + 1:04d}"

    def checkout_from_cart(self, user: User, payload: CheckoutRequest) -> Order:
        cart_service = CartService(self.db)
        cart = cart_service.get_or_create_active_cart(str(user.id))
        items = cart_service.get_items(str(cart.id))
        if not items:
            raise HTTPException(status_code=400, detail="Cannot checkout empty cart")
        student = self.student_repo.get_by_user_id(str(user.id))
        for item in items:
            self._validate_checkout_item(item, student)
        subtotal = sum(item.total_price for item in items)
        order = Order(
            user_id=user.id,
            student_id=student.id if student else None,
            cart_id=cart.id,
            order_code=self._next_code("ORD"),
            status=OrderStatus.awaiting_payment,
            currency=settings.SEPAY_CURRENCY,
            subtotal_amount=subtotal,
            discount_amount=0,
            total_amount=subtotal,
            note=payload.note,
        )
        self.order_repo.create(order)
        order_items: list[OrderItem] = []
        for item in items:
            order_item = OrderItem(
                order_id=order.id,
                course_id=item.course_id,
                class_id=item.class_id,
                course_name=item.course_name,
                course_code=item.course_code,
                unit_price=item.unit_price,
                quantity=item.quantity,
                total_price=item.total_price,
            )
            self.order_item_repo.create(order_item)
            order_items.append(order_item)
        invoice = Invoice(
            order_id=order.id,
            user_id=user.id,
            invoice_number=self._next_code("INV"),
            invoice_status=InvoiceStatus.issued,
            issued_at=now(),
            buyer_name=payload.buyer_name or user.full_name,
            buyer_email=payload.buyer_email or user.email,
            buyer_phone=payload.buyer_phone or user.phone,
            billing_address=payload.billing_address,
            currency=order.currency,
            total_amount=order.total_amount,
        )
        self.invoice_repo.create(invoice)
        for order_item in order_items:
            self.invoice_item_repo.create(
                InvoiceItem(
                    invoice_id=invoice.id,
                    course_id=order_item.course_id,
                    class_id=order_item.class_id,
                    item_name=order_item.course_name,
                    item_code=order_item.course_code,
                    unit_price=order_item.unit_price,
                    quantity=order_item.quantity,
                    total_price=order_item.total_price,
                )
            )
        cart.status = CartStatus.checked_out
        self.db.commit()
        return order

    def get_order(self, order_id: str) -> Order:
        order = self.order_repo.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order

    def get_order_by_invoice_number(self, invoice_number: str) -> Order | None:
        invoice = self.invoice_repo.get_by_invoice_number(invoice_number)
        return self.order_repo.get(str(invoice.order_id)) if invoice else None

    def get_order_by_order_code(self, order_code: str) -> Order | None:
        return self.order_repo.get_by_order_code(order_code)

    def assert_order_access(self, order: Order, user: User) -> None:
        if str(order.user_id) == str(user.id):
            return
        if self.can_access_all(user, "order.all"):
            return
        raise HTTPException(status_code=403, detail="Permission denied")

    def get_orders(self, query: PaginationParams, user: User, status: str | None = None, user_id: str | None = None) -> tuple[list[Order], int]:
        filtered_user_id = None if self.can_access_all(user, "order.all") and not user_id else str(user_id or user.id)
        filtered_status = parse_enum(OrderStatus, status, "order status") if status else None
        items = self.order_repo.list_filtered(user_id=filtered_user_id, status=filtered_status)
        total = len(items)
        items = items[(query.page - 1) * query.page_size : query.page * query.page_size]
        return items, total

    def cancel_order(self, order_id: str, user: User) -> Order:
        order = self.get_order(order_id)
        self.assert_order_access(order, user)
        if order.status == OrderStatus.paid:
            raise HTTPException(status_code=400, detail="Cannot cancel paid order")
        order.status = OrderStatus.cancelled
        order.cancelled_at = now()
        self.db.commit()
        self.db.refresh(order)
        return order


class EnrollmentService(AccessMixin):
    def __init__(self, db: Session) -> None:
        super().__init__(db)
        self.enrollment_repo = CourseEnrollmentRepository(db)
        self.course_repo = CourseRepository(db)
        self.class_repo = CourseClassRepository(db)
        self.class_student_repo = ClassStudentRepository(db)

    def _upsert_class_student(self, class_id: str, student_id: str, enrollment_id: str) -> None:
        class_obj = self.class_repo.get_active_by_id(class_id)
        if not class_obj:
            return
        if class_obj.status in {ClassStatus.cancelled, ClassStatus.completed, ClassStatus.archived}:
            return
        existing = self.class_student_repo.get_by_class_and_student_including_deleted(class_id, student_id)
        if existing and existing.deleted_at is None and existing.enrollment_status not in {ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped}:
            return
        if existing:
            existing.enrollment_id = enrollment_id
            existing.enrollment_status = ClassEnrollmentStatus.enrolled
            existing.enrolled_at = now()
            existing.note = "Auto enrollment from paid order"
            self.class_student_repo.restore(existing)
        else:
            self.class_student_repo.create(
                ClassStudent(
                    class_id=class_id,
                    student_id=student_id,
                    enrollment_id=enrollment_id,
                    enrollment_status=ClassEnrollmentStatus.enrolled,
                    enrolled_at=now(),
                    note="Auto enrollment from paid order",
                )
            )

    def create_enrollments_from_order(self, order: Order) -> None:
        items = OrderSerializer(self.db).order_items(str(order.id))
        for item in items:
            exists = self.enrollment_repo.get_by_user_and_course(str(order.user_id), str(item.course_id))
            if not exists:
                exists = self.enrollment_repo.create(
                    CourseEnrollment(
                        user_id=order.user_id,
                        student_id=order.student_id,
                        course_id=item.course_id,
                        order_id=order.id,
                        order_item_id=item.id,
                        enrollment_status=EnrollmentStatus.active,
                        enrolled_at=now(),
                    )
                )
            if item.class_id and exists and exists.student_id:
                self._upsert_class_student(str(item.class_id), str(exists.student_id), str(exists.id))

    def enrollment_dict(self, enrollment: CourseEnrollment) -> dict[str, Any]:
        course = self.course_repo.get(str(enrollment.course_id))
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        course_service = CourseService(self.db)
        return {
            "id": str(enrollment.id),
            "course_id": str(enrollment.course_id),
            "course": {
                "id": str(course.id),
                "name": course.name,
                "code": course.code,
                "thumbnail_url": course_service._course_base_dict(course)["thumbnail_url"],
            },
            "order_id": str(enrollment.order_id) if enrollment.order_id else None,
            "enrollment_status": enrollment.enrollment_status.value,
            "enrolled_at": enrollment.enrolled_at,
        }

    def get_enrollments(self, query: PaginationParams, user: User) -> tuple[list[CourseEnrollment], int]:
        filtered_user_id = None if self.can_access_all(user, "order.all") else str(user.id)
        items = self.enrollment_repo.list_filtered(filtered_user_id)
        total = len(items)
        items = items[(query.page - 1) * query.page_size : query.page * query.page_size]
        return items, total

    def get_my_enrollments(self, query: PaginationParams, user: User) -> tuple[list[CourseEnrollment], int]:
        items = self.enrollment_repo.list_filtered(str(user.id))
        total = len(items)
        items = items[(query.page - 1) * query.page_size : query.page * query.page_size]
        return items, total


class PaymentService(AccessMixin):
    def __init__(self, db: Session) -> None:
        super().__init__(db)
        self.payment_repo = PaymentRepository(db)
        self.log_repo = PaymentWebhookLogRepository(db)

    def _to_order_payment_method(self, method: PaymentMethod) -> OrderPaymentMethod:
        mapping = {
            PaymentMethod.bank_transfer: OrderPaymentMethod.manual_bank_transfer,
            PaymentMethod.cash: OrderPaymentMethod.manual_cash,
            PaymentMethod.payment_gateway: OrderPaymentMethod.sepay_bank_transfer,
        }
        return mapping[method]

    def _apply_paid_state(
        self,
        order: Order,
        invoice: Invoice | None,
        payment: Payment | None,
        external_transaction_id: str | None = None,
        external_order_id: str | None = None,
    ) -> None:
        order.status = OrderStatus.paid
        order.completed_at = order.completed_at or now()
        if invoice:
            invoice.invoice_status = InvoiceStatus.paid
            invoice.paid_at = invoice.paid_at or now()
        if payment:
            payment.status = PaymentStatus.success
            payment.paid_at = payment.paid_at or now()
            if external_transaction_id:
                payment.external_transaction_id = external_transaction_id
                payment.provider_transaction_id = external_transaction_id
            if external_order_id:
                payment.external_order_id = external_order_id
        EnrollmentService(self.db).create_enrollments_from_order(order)

    async def create_sepay_payment(self, order_id: str, payment_method: str, user: User) -> Payment:
        order_service = OrderService(self.db)
        order = order_service.get_order(order_id)
        order_service.assert_order_access(order, user)
        if order.status in {OrderStatus.paid, OrderStatus.cancelled, OrderStatus.expired}:
            raise HTTPException(status_code=400, detail="Order cannot be paid")
        method = parse_enum(PaymentMethod, payment_method, "payment method")
        invoice = OrderSerializer(self.db).invoice(str(order.id))
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        checkout = await SePayService().create_checkout_payment(order, method.value)
        payment = Payment(
            order_id=order.id,
            invoice_id=invoice.id,
            user_id=order.user_id,
            provider=PaymentProvider.sepay,
            payment_method=method,
            status=PaymentStatus.pending,
            amount=order.total_amount,
            currency=order.currency,
            external_order_id=order.order_code,
            checkout_url=checkout["checkout_url"],
            raw_request=checkout["checkout_form_fields"],
            raw_response={**checkout["raw_response"], "checkout_form_fields": checkout["checkout_form_fields"]},
        )
        self.payment_repo.create(payment)
        self.db.commit()
        return payment

    def mark_order_paid_for_testing(
        self,
        order_id: str,
        user: User,
        payment_method: str = "MANUAL_BANK_TRANSFER",
        reference: str | None = None,
    ) -> Order:
        if settings.APP_ENV.strip().lower() in {"production", "prod"}:
            raise HTTPException(status_code=403, detail="This endpoint is disabled in production")

        order_service = OrderService(self.db)
        order = order_service.get_order(order_id)
        order_service.assert_order_access(order, user)
        if order.status in {OrderStatus.cancelled, OrderStatus.expired, OrderStatus.refunded}:
            raise HTTPException(status_code=400, detail="Order cannot be marked paid")
        if order.status == OrderStatus.paid:
            return order

        invoice = OrderSerializer(self.db).invoice(str(order.id))
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")

        method = parse_enum(PaymentMethod, payment_method, "payment method")
        sepay_payment = self.payment_repo.get_latest_by_order_and_provider(str(order.id), PaymentProvider.sepay)
        payment: Payment | None = (
            sepay_payment
            if sepay_payment and sepay_payment.status in {PaymentStatus.pending, PaymentStatus.processing}
            else None
        )
        if payment is None:
            payment = Payment(
                order_id=order.id,
                invoice_id=invoice.id,
                user_id=order.user_id,
                provider=PaymentProvider.cash,
                payment_method=method,
                status=PaymentStatus.success,
                amount=order.total_amount,
                currency=order.currency,
                external_order_id=order.order_code,
                external_transaction_id=reference,
                provider_transaction_id=reference,
                raw_response={"manual_mark_paid": True, "reference": reference},
            )
            self.payment_repo.create(payment)
        else:
            payment.payment_method = method
            payment.status = PaymentStatus.success
            payment.external_order_id = order.order_code
            payment.external_transaction_id = reference
            payment.provider_transaction_id = reference
            payment.raw_response = {**(payment.raw_response or {}), "manual_mark_paid": True, "reference": reference}

        self._apply_paid_state(order, invoice, payment, external_transaction_id=reference, external_order_id=order.order_code)
        self.db.commit()
        self.db.refresh(order)
        return order

    def get_payment(self, payment_id: str, user: User) -> Payment:
        payment = self.payment_repo.get(payment_id)
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        order = OrderService(self.db).get_order(str(payment.order_id))
        OrderService(self.db).assert_order_access(order, user)
        return payment

    def get_order_payments(self, order_id: str, user: User) -> list[Payment]:
        order = OrderService(self.db).get_order(order_id)
        OrderService(self.db).assert_order_access(order, user)
        return OrderSerializer(self.db).payments(order_id)

    def handle_sepay_ipn(self, payload: dict[str, Any], headers: dict[str, str]) -> tuple[bool, int]:
        sepay = SePayService()
        parsed = sepay.parse_ipn_payload(payload)
        log = PaymentWebhookLog(
            provider=PaymentProvider.sepay,
            external_order_id=parsed["external_order_id"],
            external_transaction_id=parsed["external_transaction_id"],
            event_type=parsed["event_type"],
            payload=payload,
            headers=dict(headers),
            is_valid=False,
        )
        self.log_repo.create(log)
        if not sepay.verify_ipn_secret(headers):
            log.error_message = "Invalid IPN secret"
            self.db.commit()
            return False, 401
        order_service = OrderService(self.db)
        order = order_service.get_order_by_order_code(parsed["external_order_id"]) if parsed["external_order_id"] else None
        if not order and parsed.get("invoice_number"):
            order = order_service.get_order_by_invoice_number(parsed["invoice_number"])
        if not order:
            log.error_message = "Order not found"
            log.processed_at = now()
            self.db.commit()
            return True, 200
        invoice = OrderSerializer(self.db).invoice(str(order.id))
        payment = self.payment_repo.get_by_external_transaction_id(parsed["external_transaction_id"]) or self.payment_repo.get_latest_by_order_and_provider(str(order.id), PaymentProvider.sepay)
        log.order_id = order.id
        log.payment_id = payment.id if payment else None
        if parsed["currency"] != order.currency or parsed["amount"] != Decimal(order.total_amount):
            log.error_message = "Invalid amount or currency"
            self.db.commit()
            return True, 200
        duplicate = self.log_repo.has_valid_event(PaymentProvider.sepay.value, parsed["external_transaction_id"], parsed["event_type"], str(log.id))
        if duplicate:
            log.is_valid = True
            log.processed_at = now()
            self.db.commit()
            return True, 200
        if sepay.is_paid_ipn(payload):
            if payment is None:
                payment = Payment(
                    order_id=order.id,
                    invoice_id=invoice.id if invoice else None,
                    user_id=order.user_id,
                    provider=PaymentProvider.sepay,
                    payment_method=parse_enum(PaymentMethod, parsed.get("payment_method") or "payment_gateway", "payment method"),
                    status=PaymentStatus.pending,
                    amount=order.total_amount,
                    currency=order.currency,
                    external_order_id=parsed["external_order_id"] or order.order_code,
                    external_transaction_id=parsed["external_transaction_id"],
                    provider_transaction_id=parsed["external_transaction_id"],
                    raw_response={"webhook_created": True},
                )
                self.payment_repo.create(payment)
                log.payment_id = payment.id
            self._apply_paid_state(
                order,
                invoice,
                payment,
                external_transaction_id=parsed["external_transaction_id"],
                external_order_id=parsed["external_order_id"] or order.order_code,
            )
        log.is_valid = True
        log.processed_at = now()
        self.db.commit()
        return True, 200


def mark_order_paid_for_testing(
    db: Session,
    order_id: str,
    user: User,
    payment_method: str = "MANUAL_BANK_TRANSFER",
    reference: str | None = None,
) -> Order:
    return PaymentService(db).mark_order_paid_for_testing(order_id, user, payment_method, reference)
