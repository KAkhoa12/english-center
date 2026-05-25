def user_to_dict(user: object, include_meta: bool = True) -> dict:
    base = {
        "id": str(user.id),
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
    }
    if include_meta:
        base.update(
            {
                "avatar_url": getattr(user, "avatar_url", None),
                "status": user.status.value if getattr(user, "status", None) else None,
                "is_verified": getattr(user, "is_verified", None),
            }
        )
    return base
