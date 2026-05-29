from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.config import settings
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
    SePayIPNLog,
)
from app.models.course import Course, CourseStatus
from app.models.student import Student
from app.models import User
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
        raise HTTPException(status_code=400, detail=f"Invalid {field_name}") from exc


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

    def get_or_create_active_cart(self, user_id: str) -> Cart:
        cart = self.db.execute(
            select(Cart).where(Cart.user_id == user_id, Cart.status == CartStatus.active, Cart.deleted_at.is_(None))
        ).scalar_one_or_none()
        if cart:
            return cart
        cart = Cart(user_id=user_id, status=CartStatus.active)
        self.db.add(cart)
        self.db.commit()
        self.db.refresh(cart)
        return cart

    def get_items(self, cart_id: str) -> list[CartItem]:
        return list(
            self.db.execute(select(CartItem).where(CartItem.cart_id == cart_id, CartItem.deleted_at.is_(None))).scalars().all()
        )

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

    def add_course_to_cart(self, user_id: str, course_id: str) -> Cart:
        cart = self.get_or_create_active_cart(user_id)
        course = self.db.execute(
            select(Course).where(Course.id == course_id, Course.status == CourseStatus.active, Course.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not course:
            raise HTTPException(status_code=404, detail="Active course not found")
        exists = self.db.execute(
            select(CartItem).where(CartItem.cart_id == cart.id, CartItem.course_id == course.id)
        ).scalar_one_or_none()
        if exists and exists.deleted_at is None:
            raise HTTPException(status_code=400, detail="Course already exists in cart")
        if exists:
            exists.deleted_at = None
            exists.course_name = course.name
            exists.course_code = course.code
            exists.unit_price = course.price
            exists.quantity = 1
            exists.total_price = course.price
        else:
            self.db.add(
                CartItem(
                cart_id=cart.id,
                course_id=course.id,
                course_name=course.name,
                course_code=course.code,
                unit_price=course.price,
                quantity=1,
                total_price=course.price,
                )
            )
        self.db.commit()
        self.db.refresh(cart)
        return cart

    def update_cart_item(self, user_id: str, cart_item_id: str, quantity: int) -> Cart:
        if quantity != 1:
            raise HTTPException(status_code=400, detail="Course quantity must be 1")
        cart = self.get_or_create_active_cart(user_id)
        item = self.db.execute(
            select(CartItem).where(CartItem.id == cart_item_id, CartItem.cart_id == cart.id, CartItem.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        item.quantity = quantity
        item.total_price = item.unit_price * quantity
        self.db.commit()
        return cart

    def remove_cart_item(self, user_id: str, cart_item_id: str) -> Cart:
        cart = self.get_or_create_active_cart(user_id)
        item = self.db.execute(
            select(CartItem).where(CartItem.id == cart_item_id, CartItem.cart_id == cart.id, CartItem.deleted_at.is_(None))
        ).scalar_one_or_none()
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

    def get_wishlist(self, user_id: str, query: PaginationParams) -> tuple[list[dict[str, Any]], int]:
        stmt = (
            select(CourseWishlist, Course)
            .join(Course, Course.id == CourseWishlist.course_id)
            .where(CourseWishlist.user_id == user_id, CourseWishlist.deleted_at.is_(None), Course.deleted_at.is_(None))
        )
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        rows = self.db.execute(stmt).all()
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
        course = self.db.execute(select(Course).where(Course.id == course_id, Course.status == CourseStatus.active, Course.deleted_at.is_(None))).scalar_one_or_none()
        if not course:
            raise HTTPException(status_code=404, detail="Active course not found")
        item = self.db.execute(select(CourseWishlist).where(CourseWishlist.user_id == user_id, CourseWishlist.course_id == course_id)).scalar_one_or_none()
        if item and item.deleted_at is None:
            raise HTTPException(status_code=400, detail="Course already exists in wishlist")
        if item:
            item.deleted_at = None
        else:
            item = CourseWishlist(user_id=user_id, course_id=course_id)
            self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_from_wishlist(self, user_id: str, course_id: str) -> None:
        item = self.db.execute(
            select(CourseWishlist).where(CourseWishlist.user_id == user_id, CourseWishlist.course_id == course_id, CourseWishlist.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail="Wishlist item not found")
        item.deleted_at = now()
        self.db.commit()

    def is_favorited(self, user_id: str, course_id: str) -> bool:
        return self.db.execute(
            select(CourseWishlist).where(CourseWishlist.user_id == user_id, CourseWishlist.course_id == course_id, CourseWishlist.deleted_at.is_(None))
        ).scalar_one_or_none() is not None


class OrderSerializer:
    def __init__(self, db: Session) -> None:
        self.db = db

    def order_items(self, order_id: str) -> list[OrderItem]:
        return list(self.db.execute(select(OrderItem).where(OrderItem.order_id == order_id, OrderItem.deleted_at.is_(None))).scalars().all())

    def invoice(self, order_id: str) -> Invoice | None:
        return self.db.execute(select(Invoice).where(Invoice.order_id == order_id, Invoice.deleted_at.is_(None))).scalar_one_or_none()

    def payments(self, order_id: str) -> list[Payment]:
        return list(self.db.execute(select(Payment).where(Payment.order_id == order_id, Payment.deleted_at.is_(None))).scalars().all())

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
            "provider_transaction_id": payment.provider_transaction_id,
        }

    def order_detail(self, order: Order) -> dict[str, Any]:
        invoice = self.invoice(str(order.id))
        return {
            "id": str(order.id),
            "user_id": str(order.user_id),
            "order_code": order.order_code,
            "invoice_number": order.invoice_number,
            "status": order.status.value,
            "currency": order.currency,
            "subtotal_amount": money(order.subtotal_amount),
            "discount_amount": money(order.discount_amount),
            "total_amount": money(order.total_amount),
            "payment_method": order.payment_method.value if order.payment_method else None,
            "items": [
                {
                    "id": str(item.id),
                    "course_id": str(item.course_id),
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

    def invoice_detail(self, invoice: Invoice) -> dict[str, Any]:
        items = self.db.execute(select(InvoiceItem).where(InvoiceItem.invoice_id == invoice.id, InvoiceItem.deleted_at.is_(None))).scalars().all()
        return {
            "id": str(invoice.id),
            "order_id": str(invoice.order_id),
            "invoice_number": invoice.invoice_number,
            "invoice_status": invoice.invoice_status.value,
            "buyer_name": invoice.buyer_name,
            "buyer_email": invoice.buyer_email,
            "buyer_phone": invoice.buyer_phone,
            "currency": invoice.currency,
            "subtotal_amount": money(invoice.subtotal_amount),
            "discount_amount": money(invoice.discount_amount),
            "total_amount": money(invoice.total_amount),
            "items": [
                {
                    "id": str(item.id),
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
        invoice = self.db.execute(select(Invoice).where(Invoice.id == invoice_id, Invoice.deleted_at.is_(None))).scalar_one_or_none()
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
        stmt = select(Invoice).where(Invoice.deleted_at.is_(None))
        can_all = RBACService(self.db).has_permission(str(user.id), "invoice.all") or RBACService(self.db).has_permission(str(user.id), "admin.all")
        if not can_all:
            stmt = stmt.where(Invoice.user_id == user.id)
        elif user_id:
            stmt = stmt.where(Invoice.user_id == user_id)
        if status:
            stmt = stmt.where(Invoice.invoice_status == parse_enum(InvoiceStatus, status, "invoice status"))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(Invoice.created_at.desc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_invoice_by_order(self, order_id: str, user: User) -> Invoice:
        order = OrderService(self.db).get_order(order_id)
        OrderService(self.db).assert_order_access(order, user)
        invoice = self.db.execute(select(Invoice).where(Invoice.order_id == order.id, Invoice.deleted_at.is_(None))).scalar_one_or_none()
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        return invoice


class OrderService(AccessMixin):
    def _next_code(self, prefix: str) -> str:
        stamp = now().strftime("%Y%m%d")
        count = self.db.execute(select(func.count()).select_from(Order).where(Order.created_at >= now().replace(hour=0, minute=0, second=0, microsecond=0))).scalar_one()
        return f"{prefix}{stamp}{int(count) + 1:04d}"

    def checkout_from_cart(self, user: User, payload: CheckoutRequest) -> Order:
        cart_service = CartService(self.db)
        cart = cart_service.get_or_create_active_cart(str(user.id))
        items = cart_service.get_items(str(cart.id))
        if not items:
            raise HTTPException(status_code=400, detail="Cannot checkout empty cart")
        student = self.db.execute(select(Student).where(Student.user_id == user.id, Student.deleted_at.is_(None))).scalar_one_or_none()
        subtotal = sum(item.total_price for item in items)
        order = Order(
            user_id=user.id,
            student_id=student.id if student else None,
            cart_id=cart.id,
            order_code=self._next_code("ORD"),
            invoice_number=self._next_code("INV"),
            status=OrderStatus.awaiting_payment,
            currency=settings.SEPAY_CURRENCY,
            subtotal_amount=subtotal,
            discount_amount=0,
            total_amount=subtotal,
            note=payload.note,
        )
        self.db.add(order)
        self.db.flush()
        order_items: list[OrderItem] = []
        for item in items:
            order_item = OrderItem(
                order_id=order.id,
                course_id=item.course_id,
                course_name=item.course_name,
                course_code=item.course_code,
                unit_price=item.unit_price,
                quantity=item.quantity,
                total_price=item.total_price,
            )
            self.db.add(order_item)
            order_items.append(order_item)
        invoice = Invoice(
            order_id=order.id,
            user_id=user.id,
            invoice_number=order.invoice_number,
            invoice_status=InvoiceStatus.issued,
            issued_at=now(),
            buyer_name=payload.buyer_name or user.full_name,
            buyer_email=payload.buyer_email or user.email,
            buyer_phone=payload.buyer_phone or user.phone,
            billing_address=payload.billing_address,
            currency=order.currency,
            subtotal_amount=order.subtotal_amount,
            discount_amount=order.discount_amount,
            total_amount=order.total_amount,
        )
        self.db.add(invoice)
        self.db.flush()
        for order_item in order_items:
            self.db.add(
                InvoiceItem(
                    invoice_id=invoice.id,
                    course_id=order_item.course_id,
                    item_name=order_item.course_name,
                    item_code=order_item.course_code,
                    unit_price=order_item.unit_price,
                    quantity=order_item.quantity,
                    total_price=order_item.total_price,
                )
            )
        cart.status = CartStatus.checked_out
        self.db.commit()
        self.db.refresh(order)
        return order

    def get_order(self, order_id: str) -> Order:
        order = self.db.execute(select(Order).where(Order.id == order_id, Order.deleted_at.is_(None))).scalar_one_or_none()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order

    def get_order_by_invoice_number(self, invoice_number: str) -> Order | None:
        return self.db.execute(select(Order).where(Order.invoice_number == invoice_number, Order.deleted_at.is_(None))).scalar_one_or_none()

    def assert_order_access(self, order: Order, user: User) -> None:
        if str(order.user_id) == str(user.id):
            return
        if self.can_access_all(user, "order.all"):
            return
        raise HTTPException(status_code=403, detail="Permission denied")

    def get_orders(self, query: PaginationParams, user: User, status: str | None = None, user_id: str | None = None) -> tuple[list[Order], int]:
        stmt = select(Order).where(Order.deleted_at.is_(None))
        if not self.can_access_all(user, "order.all"):
            stmt = stmt.where(Order.user_id == user.id)
        elif user_id:
            stmt = stmt.where(Order.user_id == user_id)
        if status:
            stmt = stmt.where(Order.status == parse_enum(OrderStatus, status, "order status"))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(Order.created_at.desc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

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
    def create_enrollments_from_order(self, order: Order) -> None:
        items = OrderSerializer(self.db).order_items(str(order.id))
        for item in items:
            exists = self.db.execute(
                select(CourseEnrollment).where(
                    CourseEnrollment.user_id == order.user_id,
                    CourseEnrollment.course_id == item.course_id,
                    CourseEnrollment.deleted_at.is_(None),
                )
            ).scalar_one_or_none()
            if not exists:
                self.db.add(
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

    def enrollment_dict(self, enrollment: CourseEnrollment) -> dict[str, Any]:
        course = self.db.execute(select(Course).where(Course.id == enrollment.course_id)).scalar_one()
        return {
            "id": str(enrollment.id),
            "course_id": str(enrollment.course_id),
            "course": {
                "id": str(course.id),
                "name": course.name,
                "code": course.code,
                "thumbnail_url": CourseService(self.db)._thumbnail_url(course),
            },
            "order_id": str(enrollment.order_id) if enrollment.order_id else None,
            "enrollment_status": enrollment.enrollment_status.value,
            "enrolled_at": enrollment.enrolled_at,
        }

    def get_enrollments(self, query: PaginationParams, user: User) -> tuple[list[CourseEnrollment], int]:
        stmt = select(CourseEnrollment).where(CourseEnrollment.deleted_at.is_(None))
        if not self.can_access_all(user, "order.all"):
            stmt = stmt.where(CourseEnrollment.user_id == user.id)
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(CourseEnrollment.enrolled_at.desc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)


class PaymentService(AccessMixin):
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
            checkout_url=checkout["checkout_url"],
            raw_request=checkout["checkout_form_fields"],
            raw_response=checkout["raw_response"],
        )
        order.payment_method = {
            PaymentMethod.BANK_TRANSFER: OrderPaymentMethod.sepay_bank_transfer,
            PaymentMethod.CARD: OrderPaymentMethod.sepay_card,
            PaymentMethod.NAPAS_BANK_TRANSFER: OrderPaymentMethod.sepay_napas_bank_transfer,
        }[method]
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        payment.raw_response = {**(payment.raw_response or {}), "checkout_form_fields": checkout["checkout_form_fields"]}
        return payment

    def get_payment(self, payment_id: str, user: User) -> Payment:
        payment = self.db.execute(select(Payment).where(Payment.id == payment_id, Payment.deleted_at.is_(None))).scalar_one_or_none()
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
        log = SePayIPNLog(
            invoice_number=parsed["invoice_number"],
            notification_type=parsed["notification_type"],
            sepay_order_id=parsed["sepay_order_id"],
            sepay_transaction_id=parsed["sepay_transaction_id"],
            transaction_status=parsed["transaction_status"],
            payload=payload,
            headers=dict(headers),
            is_valid=False,
        )
        self.db.add(log)
        self.db.flush()
        if not sepay.verify_ipn_secret(headers):
            log.error_message = "Invalid IPN secret"
            self.db.commit()
            return False, 401
        order = OrderService(self.db).get_order_by_invoice_number(parsed["invoice_number"])
        if not order:
            log.error_message = "Order not found"
            log.processed_at = now()
            self.db.commit()
            return True, 200
        invoice = OrderSerializer(self.db).invoice(str(order.id))
        payment = self.db.execute(
            select(Payment)
            .where(Payment.order_id == order.id, Payment.provider == PaymentProvider.sepay, Payment.deleted_at.is_(None))
            .order_by(Payment.created_at.desc())
        ).scalars().first()
        log.order_id = order.id
        log.payment_id = payment.id if payment else None
        if parsed["currency"] != order.currency or parsed["amount"] != Decimal(order.total_amount):
            log.error_message = "Invalid amount or currency"
            self.db.commit()
            return True, 200
        duplicate = self.db.execute(
            select(SePayIPNLog).where(
                SePayIPNLog.sepay_transaction_id == parsed["sepay_transaction_id"],
                SePayIPNLog.is_valid.is_(True),
                SePayIPNLog.id != log.id,
            )
        ).first()
        if duplicate:
            log.is_valid = True
            log.processed_at = now()
            self.db.commit()
            return True, 200
        if sepay.is_paid_ipn(payload):
            order.status = OrderStatus.paid
            order.paid_at = order.paid_at or now()
            if invoice:
                invoice.invoice_status = InvoiceStatus.paid
                invoice.paid_at = invoice.paid_at or now()
            if payment:
                payment.status = PaymentStatus.approved
                payment.provider_transaction_id = parsed["sepay_transaction_id"]
                payment.provider_payment_id = parsed["sepay_order_id"]
            EnrollmentService(self.db).create_enrollments_from_order(order)
        log.is_valid = True
        log.processed_at = now()
        self.db.commit()
        return True, 200
