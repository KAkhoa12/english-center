from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.class_model import ClassStatus, CourseClass
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.models.consultation import Consultation, ConsultationStatus
from app.models.commerce import (
    CourseEnrollment,
    CourseWishlist,
    EnrollmentStatus,
    Order,
    OrderItem,
    OrderStatus,
    Payment,
    PaymentMethod,
    PaymentProvider,
    PaymentStatus,
    PaymentType,
)
from app.models.course import CourseStatus
from app.models import User
from app.repositories.wishlist import CourseWishlistRepository
from app.repositories.consultation import ConsultationRepository
from app.repositories.course import CourseRepository
from app.repositories.course_class import CourseClassRepository
from app.repositories.course_enrollment import CourseEnrollmentRepository
from app.repositories.order import OrderItemRepository, OrderRepository
from app.repositories.payment import PaymentRepository
from app.repositories.student import StudentRepository
from app.repositories.class_student import ClassStudentRepository
from app.schemas.commerce import ConvertConsultationRequest, StaffCreateOrderRequest
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
        self.payment_repo = PaymentRepository(db)
        self.class_repo = CourseClassRepository(db)

    def order_items(self, order_id: str) -> list[OrderItem]:
        return self.order_item_repo.list_by_order_id(order_id)

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
            "payment_type": payment.payment_type.value,
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
        return {
            "id": str(order.id),
            "user_id": str(order.user_id),
            "student_id": str(order.student_id) if order.student_id else None,
            "order_code": order.order_code,
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
                    "total_price": money(item.final_amount),
                }
                for item in self.order_items(str(order.id))
            ],
            "payments": [self.payment_dict(item) for item in self.payments(str(order.id))],
        }

    def list_invoices(self, query: PaginationParams, user: User, status: str | None = None, user_id: str | None = None) -> tuple[list[dict[str, Any]], int]:
        os = OrderService(self.db)
        orders, total = os.get_orders(query, user, status, user_id)
        return [self.invoice_detail(o) for o in orders], total

    def invoice_detail(self, order: Order) -> dict[str, Any]:
        detail = self.order_detail(order)
        detail["invoice_number"] = f"INV-{order.order_code}"
        detail["invoice_date"] = order.created_at or order.completed_at
        return detail

    def get_invoice(self, invoice_id: str, user: User) -> dict[str, Any]:
        os = OrderService(self.db)
        order = os.get_order(invoice_id)
        os.assert_order_access(order, user)
        return self.invoice_detail(order)

    def get_order_invoice(self, order_id: str, user: User) -> dict[str, Any]:
        os = OrderService(self.db)
        order = os.get_order(order_id)
        os.assert_order_access(order, user)
        return self.invoice_detail(order)

    def invoice(self, order_id: str) -> dict[str, Any] | None:
        os = OrderService(self.db)
        order = os.get_order(order_id)
        return self.invoice_detail(order)


class OrderService(AccessMixin):
    def __init__(self, db: Session) -> None:
        super().__init__(db)
        self.order_repo = OrderRepository(db)
        self.order_item_repo = OrderItemRepository(db)
        self.student_repo = StudentRepository(db)
        self.course_repo = CourseRepository(db)
        self.class_repo = CourseClassRepository(db)
        self.class_student_repo = ClassStudentRepository(db)
        self.consultation_repo = ConsultationRepository(db)

    def _next_code(self, prefix: str) -> str:
        stamp = now().strftime("%Y%m%d")
        count = self.order_repo.count_created_since(now().replace(hour=0, minute=0, second=0, microsecond=0))
        return f"{prefix}{stamp}{int(count) + 1:04d}"

    def get_order(self, order_id: str) -> Order:
        order = self.order_repo.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order

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

    def convert_consultation(self, consultation_id: str, payload: ConvertConsultationRequest, user: User) -> Order:
        cons = self.consultation_repo.get_active_by_id(consultation_id)
        if not cons:
            raise HTTPException(status_code=404, detail="Consultation not found")
        if cons.status in {ConsultationStatus.converted, ConsultationStatus.rejected, ConsultationStatus.cancelled}:
            raise HTTPException(status_code=400, detail="Consultation already converted or closed")
        if not cons.interested_course_id or not cons.interested_class_id:
            raise HTTPException(status_code=400, detail="Consultation missing course/class info")

        course = self.course_repo.get(str(cons.interested_course_id))
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        class_obj = self.class_repo.get_active_by_id(str(cons.interested_class_id))
        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")

        student = self.student_repo.get(payload.student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        order = self.order_repo.create(Order(
            user_id=student.user_id, student_id=student.id,
            consultation_id=cons.id, order_code=self._next_code("ORD"),
            status=OrderStatus.awaiting_payment, currency=settings.SEPAY_CURRENCY,
            subtotal_amount=course.price, discount_amount=0, total_amount=course.price,
            note=payload.note,
        ))
        self.order_item_repo.create(OrderItem(
            order_id=order.id, course_id=course.id, class_id=class_obj.id,
            student_id=student.id, course_name=course.name, course_code=course.code,
            unit_price=course.price, discount_amount=0, final_amount=course.price,
        ))

        cons.status = ConsultationStatus.converted
        self.db.commit()
        self.db.refresh(order)
        return order

    def create_order_for_student(self, payload: StaffCreateOrderRequest, user: User) -> Order:
        course = self.course_repo.get(payload.course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        class_obj = self.class_repo.get_active_by_id(payload.class_id)
        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")
        student = self.student_repo.get(payload.student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        order = self.order_repo.create(Order(
            user_id=student.user_id, student_id=student.id,
            order_code=self._next_code("ORD"),
            status=OrderStatus.awaiting_payment, currency=settings.SEPAY_CURRENCY,
            subtotal_amount=course.price, discount_amount=0, total_amount=course.price,
            note=payload.note,
        ))
        self.order_item_repo.create(OrderItem(
            order_id=order.id, course_id=course.id, class_id=class_obj.id,
            student_id=student.id, course_name=course.name, course_code=course.code,
            unit_price=course.price, discount_amount=0, final_amount=course.price,
        ))
        EnrollmentService(self.db).create_enrollments_from_order(order)
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
        self.student_repo = StudentRepository(db)

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
            exists = self.enrollment_repo.get_by_student_and_course(str(order.student_id) if order.student_id else "", str(item.course_id))
            if not exists and order.student_id:
                exists = self.enrollment_repo.create(
                    CourseEnrollment(
                        student_id=order.student_id,
                        course_id=item.course_id,
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
            "enrollment_status": enrollment.enrollment_status.value,
            "enrolled_at": enrollment.enrolled_at,
        }

    def get_enrollments(self, query: PaginationParams, user: User) -> tuple[list[CourseEnrollment], int]:
        filtered_student_id = None
        if not self.can_access_all(user, "order.all"):
            student = self.student_repo.get_by_user_id(str(user.id))
            filtered_student_id = str(student.id) if student else "__none__"
        items = self.enrollment_repo.list_filtered(filtered_student_id)
        total = len(items)
        items = items[(query.page - 1) * query.page_size : query.page * query.page_size]
        return items, total

    def get_my_enrollments(self, query: PaginationParams, user: User) -> tuple[list[CourseEnrollment], int]:
        student = self.student_repo.get_by_user_id(str(user.id))
        student_id = str(student.id) if student else "__none__"
        items = self.enrollment_repo.list_filtered(student_id)
        total = len(items)
        items = items[(query.page - 1) * query.page_size : query.page * query.page_size]
        return items, total


class PaymentService(AccessMixin):
    def __init__(self, db: Session) -> None:
        super().__init__(db)
        self.payment_repo = PaymentRepository(db)

    def _apply_paid_state(
        self,
        order: Order,
        payment: Payment | None,
        external_transaction_id: str | None = None,
        external_order_id: str | None = None,
    ) -> None:
        order.status = OrderStatus.paid
        order.completed_at = order.completed_at or now()
        if payment:
            payment.status = PaymentStatus.success
            payment.paid_at = payment.paid_at or now()
            if external_transaction_id:
                payment.external_transaction_id = external_transaction_id
                payment.provider_transaction_id = external_transaction_id
            if external_order_id:
                payment.external_order_id = external_order_id
        EnrollmentService(self.db).create_enrollments_from_order(order)

    async def create_sepay_payment(self, order_id: str, payment_method: str, payment_type: str, user: User) -> Payment:
        order_service = OrderService(self.db)
        order = order_service.get_order(order_id)
        order_service.assert_order_access(order, user)
        if order.status in {OrderStatus.paid, OrderStatus.cancelled, OrderStatus.expired}:
            raise HTTPException(status_code=400, detail="Order cannot be paid")
        method = parse_enum(PaymentMethod, payment_method, "payment method")
        pt = parse_enum(PaymentType, payment_type, "payment type")
        checkout = await SePayService().create_checkout_payment(order, method.value)
        payment = Payment(
            order_id=order.id,
            user_id=order.user_id,
            payment_type=pt,
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

    def record_cash_payment(
        self, order_id: str, amount: float, payment_type: str,
        collected_by: User, reference: str | None = None, note: str | None = None,
    ) -> Payment:
        order_service = OrderService(self.db)
        order = order_service.get_order(order_id)
        order_service.assert_order_access(order, self.db.merge(collected_by))
        pt = parse_enum(PaymentType, payment_type, "payment type")

        payment = Payment(
            order_id=order.id,
            user_id=order.user_id,
            payment_type=pt,
            provider=PaymentProvider.cash,
            payment_method=PaymentMethod.cash,
            status=PaymentStatus.success,
            amount=amount,
            currency=order.currency,
            external_transaction_id=reference,
            provider_transaction_id=reference,
            collected_by=collected_by.id,
            paid_at=now(),
            note=note,
        )
        self.payment_repo.create(payment)
        from decimal import Decimal
        total_paid = sum(
            float(p.amount) for p in self.payment_repo.list_by_order_id(str(order.id))
            if p.status == PaymentStatus.success
        ) + amount
        if total_paid >= float(order.total_amount):
            self._apply_paid_state(order, payment, reference, order.order_code)
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
                user_id=order.user_id,
                payment_type=PaymentType.full,
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

        self._apply_paid_state(order, payment, external_transaction_id=reference, external_order_id=order.order_code)
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


def mark_order_paid_for_testing(
    db: Session,
    order_id: str,
    user: User,
    payment_method: str = "MANUAL_BANK_TRANSFER",
    reference: str | None = None,
) -> Order:
    return PaymentService(db).mark_order_paid_for_testing(order_id, user, payment_method, reference)
