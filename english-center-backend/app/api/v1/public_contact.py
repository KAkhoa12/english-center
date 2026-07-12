from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.models.consultation import Consultation, ConsultationSource, ConsultationStatus
from app.repositories.consultation import ConsultationRepository

router = APIRouter(tags=["public"])


class ContactRequest(BaseModel):
    name: str
    phone: str


@router.post("/public/contact")
def submit_contact(payload: ContactRequest, db: Annotated[Session, Depends(get_db)]):
    now = datetime.now(timezone.utc)
    repo = ConsultationRepository(db)
    repo.create(Consultation(
        customer_name=payload.name.strip(),
        customer_phone=payload.phone.strip(),
        status=ConsultationStatus.new,
        source=ConsultationSource.website,
        created_at=now,
        updated_at=now,
    ))
    db.commit()
    return api_response(True, "Contact submitted successfully", None, None)
