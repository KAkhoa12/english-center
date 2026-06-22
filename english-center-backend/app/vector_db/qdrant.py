from qdrant_client import QdrantClient, AsyncQdrantClient
from app.core.config import settings

LESSON_DOCUMENT_COLLECTION = "lesson_document"
COMPANY_DOCUMENT_COLLECTION = "company_document"
DEFAULT_COLLECTIONS = (
    LESSON_DOCUMENT_COLLECTION,
    COMPANY_DOCUMENT_COLLECTION,
)

# Khởi tạo Client đồng bộ (nếu cần dùng trong các script hoặc sync func)
qdrant_client = QdrantClient(
    host=settings.QDRANT_HOST,
    port=settings.QDRANT_PORT,
    api_key=settings.QDRANT_API_KEY,
)

# Khởi tạo Client bất đồng bộ (Khuyên dùng chính cho FastAPI)
async_qdrant_client = AsyncQdrantClient(
    host=settings.QDRANT_HOST,
    port=settings.QDRANT_PORT,
    api_key=settings.QDRANT_API_KEY,
)

# Dependency để inject vào các Router của FastAPI
async def get_qdrant_client() -> AsyncQdrantClient:
    return async_qdrant_client
