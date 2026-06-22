from qdrant_client import AsyncQdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
from typing import List, Dict, Any
import uuid

class VectorService:
    def __init__(self, qdrant_client: AsyncQdrantClient):
        self.client = qdrant_client
        self.collection_name = "kb_documents"

    async def upsert_vector(self, vector: List[float], payload: Dict[str, Any]):
        """Thêm hoặc cập nhật vector vào Qdrant"""
        point_id = str(uuid.uuid4())
        await self.client.upsert(
            collection_name=self.collection_name,
            points=[
                PointStruct(
                    id=point_id,
                    vector=vector,
                    payload=payload
                )
            ]
        )
        return point_id

    async def search_similar(self, query_vector: List[float], limit: int = 5):
        """Tìm kiếm các vector tương đồng"""
        search_result = await self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit
        )
        return [
            {
                "id": hit.id,
                "score": hit.score,
                "payload": hit.payload
            } for hit in search_result
        ]
    async def get_by_id(self, point_id: str):
        """Lấy thông tin chi tiết của 1 vector bằng ID"""
        try:
            results = await self.client.retrieve(
                collection_name=self.collection_name,
                ids=[point_id],
                with_vectors=False # Đổi thành True nếu bạn muốn lấy cả mảng float vector mã hóa
            )
            if results:
                return {
                    "id": results[0].id,
                    "payload": results[0].payload
                }
            return None
        except Exception as e:
            print(f"Error retrieving vector: {e}")
            return None

    async def delete_by_ids(self, point_ids: List[str]):
        """Xóa một hoặc nhiều vector dựa trên danh sách IDs cụ thể"""
        # point_ids có thể là chuỗi UUID hoặc số nguyên tùy cấu hình của bạn
        result = await self.client.delete(
            collection_name=self.collection_name,
            points_selector=point_ids
        )
        return result

    async def delete_by_filter(self, key: str, value: Any):
        """
        Xóa các vector dựa theo điều kiện lọc của Payload.
        Ví dụ: Xóa toàn bộ chunk thuộc về file có `file_id` cố định.
        """
        result = await self.client.delete(
            collection_name=self.collection_name,
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key=key,
                        match=MatchValue(value=value)
                    )
                ]
            )
        )
        return result
