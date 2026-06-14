import re
import unicodedata


def generate_code(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value or "")
    without_marks = "".join(char for char in normalized if unicodedata.category(char) != "Mn")
    ascii_value = without_marks.encode("ascii", "ignore").decode("ascii")
    code = re.sub(r"[^A-Za-z0-9]+", "_", ascii_value.upper()).strip("_")
    return re.sub(r"_+", "_", code)
