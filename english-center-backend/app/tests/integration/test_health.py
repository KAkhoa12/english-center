from app.tests.conftest import get_test_client


def test_health_check() -> None:
    client = get_test_client()
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["status"] == "ok"
