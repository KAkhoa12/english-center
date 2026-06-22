from app.types.roles.base import PermissionCode


class AssignmentPermission(PermissionCode):
    CREATE = "assignment.create"
    READ = "assignment.read"
    UPDATE = "assignment.update"
    DELETE = "assignment.delete"
    ALL = "assignment.all"
