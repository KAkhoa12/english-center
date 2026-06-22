
from ddgs import DDGS
result=[]
query = "Trường hợp nào nên sử dụng, Quá khứ đơn"
with DDGS() as ddgs:
    # max_results BẮT BUỘC phải truyền dạng đặt tên (keyword argument)
    results = ddgs.text(query=query, max_results=5 , keyword="quá khứ đơn")

    if not results:
        print("Không tìm thấy kết quả nào từ DuckDuckGo.")

    # Duyệt qua danh sách kết quả, lấy phần 'body' (nội dung tóm tắt) để nối lại
    string_results = []
    for r in results:
        title = r.get("title", "No Title")
        link = r.get("href", "")
        body = r.get("body", "")
        string_results.append(f"Tiêu đề: {title}\nLink: {link}\nNội dung: {body}")

    print("\n\n---\n\n".join(string_results))
