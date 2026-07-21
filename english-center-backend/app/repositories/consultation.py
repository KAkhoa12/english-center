from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.consultation import Consultation
from app.repositories.base import BaseRepository


class ConsultationRepository(BaseRepository[Consultation]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Consultation)

    def get_active_by_id(self, consultation_id: str) -> Consultation | None:
        return self.get(consultation_id)
