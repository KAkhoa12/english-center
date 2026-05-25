from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.user import User
from app.schemas.common import PaginationParams
from app.services.commerce_service import InvoiceService

router = APIRouter(tags=["invoices"])


@router.get("/invoices")
def list_invoices(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("invoice.read")),
    page: int = Query(1),
    page_size: int = Query(10),
    status: str | None = None,
    user_id: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size)
    service = InvoiceService(db)
    items, total = service.get_invoices(query, current_user, status, user_id)
    return api_response(True, "Invoices retrieved successfully", [service.invoice_detail(item) for item in items], build_pagination(page, page_size, total))


@router.get("/invoices/my")
def my_invoices(db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("invoice.read")), page: int = Query(1), page_size: int = Query(10)):
    query = PaginationParams(page=page, page_size=page_size)
    service = InvoiceService(db)
    items, total = service.get_invoices(query, current_user)
    return api_response(True, "My invoices retrieved successfully", [service.invoice_detail(item) for item in items], build_pagination(page, page_size, total))


@router.get("/invoices/{invoice_id}")
def get_invoice(invoice_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("invoice.read"))):
    service = InvoiceService(db)
    invoice = service.get_invoice(invoice_id)
    service.assert_invoice_access(invoice, current_user)
    return api_response(True, "Invoice retrieved successfully", service.invoice_detail(invoice), None)


@router.get("/orders/{order_id}/invoice")
def get_order_invoice(order_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("invoice.read"))):
    service = InvoiceService(db)
    invoice = service.get_invoice_by_order(order_id, current_user)
    return api_response(True, "Invoice retrieved successfully", service.invoice_detail(invoice), None)

