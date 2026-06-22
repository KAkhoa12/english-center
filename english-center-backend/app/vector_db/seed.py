from qdrant_client.http.models import Distance, VectorParams

from app.vector_db.qdrant import DEFAULT_COLLECTIONS, qdrant_client

DEFAULT_VECTOR_SIZE = 768


def ensure_collection(collection_name: str, vector_size: int = DEFAULT_VECTOR_SIZE) -> bool:
    if qdrant_client.collection_exists(collection_name=collection_name):
        return False

    qdrant_client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(
            size=vector_size,
            distance=Distance.COSINE,
        ),
    )
    return True


def seed_qdrant_collections() -> None:
    for collection_name in DEFAULT_COLLECTIONS:
        created = ensure_collection(collection_name)
        status = "created" if created else "exists"
        print(f"{collection_name}: {status}")


if __name__ == "__main__":
    seed_qdrant_collections()
