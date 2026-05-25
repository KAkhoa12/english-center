from fastapi import APIRouter

from app.schemas.common import APIResponse

router = APIRouter()


@router.get("", response_model=APIResponse[dict[str, str]])
def health_check() -> APIResponse[dict[str, str]]:
    return APIResponse(message="Service healthy", data={"status": "ok"})
