def has_permission(user_permissions: list[str], required_permission: str) -> bool:
    if required_permission in user_permissions:
        return True

    if "." in required_permission:
        resource = required_permission.split(".", 1)[0]
        if f"{resource}.all" in user_permissions:
            return True

    if "admin.all" in user_permissions:
        return True

    return False
