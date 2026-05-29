services/ là thư mục chính dùng để thao tác với các dịch vụ (services) của ứng dụng.

** Bắt buộc các module của services phải có 3 file bắt buộc: <tiền tố>.store.ts, <tiền tố>.type.ts, <tiền tố>.api.ts **
ví dụ service auth:
-- auth
  - auth.store.ts
  - auth.type.ts
  - auth.api.ts

## Nếu thêm 1 service mới vào services, cần tạo 3 file tương ứng:
  - .store.ts
  - .type.ts
  - .api.ts

Trình tự tạo file sẽ là 
Bước 1: Tạo .type.ts sẽ lấy các Schemas type dựa trên english-center-backend/app/schemas của module tương ứng của nó.
Bước 2: Tạo .api.ts sẽ lấy các API từ english-center-backend/app/api/v1 của module tương ứng của nó nhớ là phải respone theo format của .type.ts vừa tạo.
Bước 3: Tạo .store.ts sẽ chứa state management xử lý thao tác .api.ts.


## Nếu cần chỉnh sửa các api hiện tại cho trùng hợp với hệ thống server: 
Bước 1: vào api module mà yêu cầu cập nhập trong english-center-backend/app/api/v1
Bước 2: Xem kỹ các Schemas type trong english-center-backend/app/schemas của module tương ứng của nó để cập nhập lại .type.ts
Bước 3: Xem kỹ các api hiện tại trong english-center-backend/app/api/v1 của module tương ứng của nó để cập nhập lại .api.ts
Bước 4: Cập nhập lại .store.ts để đồng bộ lại .api.ts và thao tác thực thi


Có thể nhìn mẫu tại [auth](DoAnTotNghiep\english-center-client\src\services\auth) để hiểu rõ hơn về cách tạo và cập nhập các file này.

Khi quyết định làm hãy xem qua cấu trúc và phân tích xem các bước cần làm tiếp theo là gì, đưa hướng xử lý và trả về phần thống kê. Khi đã thống nhất hướng xử lý thì phải đợi xác nhận sau đó mới thực hiện

Khi chỉnh xong hoàn tất và build không gặp lỗi thì chỉ cần thông báo các file đã chỉnh sửa và kết luận nhỏ, nếu gặp lỗi thì hãy build lại xem xét lỗi nếu vẫn gặp lỗi thì hãy tìm hiểu lý do và sửa lại.

** Tuyệt đối không được chỉnh sửa các file khác ngoài /src/services/ khi chưa có sự cho phép**
