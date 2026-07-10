from app.api.v1.media import build_media_router

router = build_media_router("/files", "files")
