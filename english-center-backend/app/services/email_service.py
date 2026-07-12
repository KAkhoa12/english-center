import httpx

from app.core.config import settings


def send_reset_password_email(to_email: str, reset_link: str) -> None:
    httpx.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
        json={
            "from": "onboarding@resend.dev",
            "to": [to_email],
            "subject": "Đặt lại mật khẩu",
            "html": f"<p>Nhấp vào link sau để đặt lại mật khẩu: <a href='{reset_link}'>{reset_link}</a></p>",
        },
        timeout=30,
    )
