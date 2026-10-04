Chào bạn, với tư cách là **PLANNER**, trước tiên tôi cần thực hiện bước khảo sát codebase hiện tại (sử dụng các công cụ `Glob`, `Grep`, `Read` nếu có) để hiểu rõ cấu trúc dự án. Tuy nhiên, do đây là một yêu cầu khởi tạo hoặc tôi đang ở lượt phản hồi đầu tiên, tôi sẽ đưa ra bản kế hoạch tổng quan dựa trên yêu cầu: **"Tạo một web chuyên về nhạc có tất cả bài nhạc"**.

*Lưu ý: Vì yêu cầu này khá rộng ("tất cả bài nhạc" là một tập dữ liệu vô hạn hoặc cần định nghĩa nguồn nhạc từ đâu), tôi sẽ đặt các câu hỏi bỏ ngỏ lên đầu theo đúng quy chuẩn.*

---

### CÂU HỎI CÒN BỎ NGỎ (Cần người dùng quyết định)
1. **Nguồn dữ liệu nhạc:** "Tất cả bài nhạc" sẽ được lấy từ đâu? (Ví dụ: Tự upload file MP3 thủ công, tích hợp API bên thứ ba như Spotify/SoundCloud/YouTube, hay crawl từ một nguồn cụ thể?)
2. **Cơ sở dữ liệu:** Dự án hiện tại đang dùng database nào (MongoDB, PostgreSQL, SQLite, hay chỉ lưu file JSON/Local Storage)?
3. **Tính năng cốt lõi bắt buộc:** Web cần các tính năng gì ở giai đoạn đầu? (Ví dụ: Trình phát nhạc nổi/mini-player, tìm kiếm, tạo playlist, yêu thích, phân loại nghệ sĩ/album?)

---

### KẾ HOẠCH TRIỂN KHAI CHI TIẾT (`.bangiao/ke-hoach.md`)

#### 1. Mục tiêu
Xây dựng một website nghe nhạc trực tuyến (Web Music Player) có khả năng quản lý, hiển thị và phát các bài hát, đáp ứng trải nghiệm người dùng mượt mà, giao diện trực quan (Dark/Light mode, trình phát nhạc cố định dưới chân trang).

#### 2. Các file cần tạo/sửa (Dự kiến cấu trúc Next.js/React hoặc Node.js tùy codebase thực tế)
*   `src/models/Track.ts` (hoặc schema tương đương): Định nghĩa cấu trúc dữ liệu cho bài hát (title, artist, duration, coverUrl, audioUrl, genre).
*   `src/app/api/tracks/route.ts`: API lấy danh sách bài hát và thêm bài hát mới.
*   `src/components/Player.tsx`: Component trình phát nhạc chính (Play, Pause, Seekbar, Volume, Next/Prev).
*   `src/components/TrackList.tsx`: Hiển thị danh sách toàn bộ bài nhạc.
*   `src/components/Sidebar.tsx` hoặc `Navbar.tsx`: Điều hướng giữa các trang (Trang chủ, Khám phá, Thư viện).
*   `src/app/page.tsx`: Trang chủ hiển thị tổng quan các bài nhạc.

#### 3. Các bước thực hiện cho Coder
1.  **Bước 1: Khảo sát và Chuẩn bị Schema**
    *   Kiểm tra kết nối Database hiện tại của dự án.
    *   Tạo/cập nhật Model dữ liệu cho `Track` (Bài hát) và `Playlist`.
2.  **Bước 2: Xây dựng Backend APIs**
    *   Viết API Endpoint `GET /api/tracks` để lấy toàn bộ danh sách bài nhạc.
    *   Viết API hỗ trợ tìm kiếm bài hát theo tên hoặc nghệ sĩ (`GET /api/tracks/search?q=...`).
3.  **Bước 3: Xây dựng Global Audio Player State**
    *   Sử dụng React Context hoặc Zustand để quản lý trạng thái phát nhạc toàn cục (đảm bảo nhạc không bị ngắt khi chuyển trang).
4.  **Bước 4: Phát triển UI Components**
    *   Làm giao diện danh sách bài nhạc (`TrackList`).
    *   Làm thanh điều khiển nhạc dưới cùng (`Player`) với các nút điều hướng cơ bản.
5.  **Bước 5: Tích hợp và Tối ưu**
    *   Kết nối UI với API.
    *   Xử lý các trường hợp biên (file audio lỗi, mạng chậm, không tìm thấy bài hát).

#### 4. Cách kiểm tra (Testing)
*   **Unit Test:** Kiểm tra các hàm helper xử lý định dạng thời gian bài hát (MM:SS).
*   **Integration Test:** Kiểm tra API `GET /api/tracks` trả về đúng định dạng JSON danh sách bài nhạc.
*   **Manual Test:**
    *   Mở trang web, danh sách bài nhạc hiển thị đầy đủ.
    *   Bấm Play một bài hát $\rightarrow$ Thanh player dưới cùng hoạt động, âm thanh phát ra đúng.
    *   Thử chuyển trang $\rightarrow$ Nhạc vẫn tiếp tục phát (nếu áp dụng persistent player).
    *   Thử tìm kiếm bài hát theo tên.

#### 5. Rủi ro
*   **Bản quyền & Lưu trữ:** Lưu trữ lượng lớn file âm thanh (MP3) có thể làm quá tải băng thông và dung lượng server nếu không dùng dịch vụ lưu trữ đám mây chuyên dụng (AWS S3, Cloudinary).
*   **Hiệu năng (Performance):** Nếu danh sách "tất cả bài nhạc" lên tới hàng chục nghìn bài mà không phân trang (Pagination) hoặc cuộn vô hạn (Infinite Scroll), DOM sẽ bị nặng và giật lag.

---
*Kế hoạch này sẽ được lưu chi tiết vào `.bangiao/ke-hoach.md` ngay sau khi bạn giải đáp các câu hỏi bỏ ngỏ ở trên để Coder có thể bắt tay vào code chính xác nhất.*
