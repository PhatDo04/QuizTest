# 📝 QuizTest - Ứng Dụng Trắc Nghiệm

Ứng dụng web trắc nghiệm đa năng, hỗ trợ nhiều đề thi với tính năng phản hồi tức thì và phân trang thông minh.

## 📚 Nội dung bộ câu hỏi

Ứng dụng hiện tại bao gồm **8 đề thi** với tổng cộng **hơn 450 câu hỏi** về Kiểm thử phần mềm (Software Testing) dựa trên chuẩn ISTQB:

### Các đề thi có sẵn:

- **Đề 1 (Q. 1 → Q. 74)**: 50 câu hỏi cơ bản về Software Testing Foundation
- **Đề 2 (Q. 75 → Q. 154)**: 50 câu hỏi về các kỹ thuật kiểm thử
- **Đề 3**: 50 câu hỏi về quy trình kiểm thử
- **Đề 4**: 50 câu hỏi về quản lý kiểm thử
- **Đề 5**: 50 câu hỏi về công cụ hỗ trợ kiểm thử
- **Đề 6**: 50 câu hỏi nâng cao về test design
- **Đề 7**: 50 câu hỏi về kiểm thử tĩnh và động
- **Đề 8 (Q. 16 → Q. 482)**: Câu hỏi có kèm code và sơ đồ

### Chủ đề bao gồm:

- ✅ **Nguyên tắc cơ bản của kiểm thử** (Testing Fundamentals)
- ✅ **Quy trình kiểm thử** (Test Process)
- ✅ **Các mức kiểm thử** (Test Levels)
  - Component Testing
  - Integration Testing
  - System Testing
  - Acceptance Testing
- ✅ **Kỹ thuật kiểm thử** (Test Techniques)
  - Black-box Testing (Equivalence Partitioning, Boundary Value Analysis)
  - White-box Testing (Statement Coverage, Decision Coverage)
  - Experience-based Testing
- ✅ **Quản lý kiểm thử** (Test Management)
  - Test Planning
  - Test Monitoring and Control
  - Configuration Management
  - Risk Management
- ✅ **Công cụ kiểm thử** (Test Tools)
  - Test Management Tools
  - Static Analysis Tools
  - Performance Testing Tools
- ✅ **Kiểm thử tĩnh** (Static Testing)
  - Reviews
  - Static Analysis
- ✅ **Phân tích độ phức tạp** (Cyclomatic Complexity)

### Đặc điểm câu hỏi:

- 📝 **Đa dạng định dạng**: Câu hỏi lý thuyết, bài tập thực hành, phân tích code
- 🖼️ **Có hình ảnh minh họa**: Sơ đồ trạng thái, bảng quyết định, flowchart
- 💻 **Code examples**: Câu hỏi có đoạn mã để phân tích độ bao phủ
- 📊 **Bảng và biểu đồ**: Decision tables, state transition diagrams
- ✏️ **Giải thích chi tiết**: Mỗi câu đều có lời giải và tham chiếu lý thuyết

## ✨ Tính năng chính

### 🎯 Quản lý đề thi

- **Chọn đề thi linh hoạt**: Hỗ trợ nhiều đề thi trong một ứng dụng
- **Hiển thị thông tin đề**: Số câu hỏi, tên đề thi rõ ràng
- **Nút quay lại**: Dễ dàng chuyển đổi giữa các đề

### 📄 Phân trang thông minh

- **20 câu hỏi mỗi trang**: Tối ưu trải nghiệm người dùng
- **Điều hướng dễ dàng**: Nút Previous/Next và nhảy trực tiếp đến trang
- **Thông tin trang**: Hiển thị "Trang X/Y (Câu A-B/Tổng)"

### ✅ Phản hồi tức thì

- **Kiểm tra ngay lập tức**: Hiển thị đúng/sai ngay khi chọn đáp án
- **Màu sắc trực quan**:
  - 🟢 Xanh lá khi đúng (với animation pulse)
  - 🔴 Đỏ khi sai (với animation shake)
- **Giải thích chi tiết**: Hiển thị đáp án đúng và lời giải
- **Highlight đáp án đúng**: Tự động làm nổi bật khi chọn sai

### 🖼️ Hỗ trợ hình ảnh

- **Tự động load ảnh**: Từ thư mục `img/` dựa trên số câu hỏi (vd: `q1.png`)
- **Thử nhiều định dạng**: PNG → JPG → JPEG → GIF → WEBP
- **Click để phóng to**: Modal xem ảnh full screen
- **Responsive**: Tối ưu trên mọi thiết bị

### 📐 Format câu hỏi thông minh

Tự động xuống dòng và làm nổi bật các pattern:

- ✅ Chữ số La Mã: `i)`, `ii)`, `iii)`, `i.`, `ii.`, `iii.`
- ✅ Chữ cái: `a)`, `b)`, `c)`, `a.`, `b.`, `c.`
- ✅ Số: `1)`, `2)`, `3)`, `1.`, `2.`, `3.`
- ✅ Chữ IN HOA: `A.`, `B.`, `C.`, `W.`, `X.`, `Y.`, `Z.`
- ✅ Hỗ trợ `\n` trong JSON

### 💾 Lưu trạng thái

- **Giữ câu trả lời**: Không mất dữ liệu khi chuyển trang
- **Hiển thị lại**: Tự động khôi phục câu đã chọn

## 🚀 Cài đặt và Sử dụng

### Yêu cầu

- Web browser hiện đại (Chrome, Firefox, Edge, Safari)
- Web server (để load file JSON)

### Cách 1: Sử dụng Live Server (VS Code)

1. Cài extension **Live Server** trong VS Code
2. Click phải vào `index.html` → **Open with Live Server**
3. Ứng dụng sẽ mở tại `http://127.0.0.1:5500`

### Cách 2: Sử dụng Python HTTP Server

```bash
cd QuizTest
python -m http.server 8000
```

Sau đó mở trình duyệt tại: `http://localhost:8000`

### Cách 3: Sử dụng Node.js

```bash
npx http-server -p 8000
```

## 📁 Cấu trúc thư mục

```
QuizTest/
├── img/                    # Thư mục chứa ảnh câu hỏi
│   ├── q1.png             # Ảnh cho câu Q.1
│   ├── q2.jpg             # Ảnh cho câu Q.2
│   └── ...
├── index.html             # Giao diện chính
├── app.js                 # Logic ứng dụng
├── style.css              # Styling
├── quiz.json              # Dữ liệu câu hỏi
└── README.md              # Tài liệu này
```

## 📝 Định dạng dữ liệu JSON

### Cấu trúc cơ bản

```json
{
  "Đề 1 (Q. 1 -> Q. 74)": [
    {
      "Câu": "Q. 1: Nội dung câu hỏi?",
      "các đáp án": [
        "A. Đáp án A",
        "B. Đáp án B",
        "C. Đáp án C",
        "D. Đáp án D"
      ],
      "đáp án đúng": "A. Đáp án A (Giải thích chi tiết)",
      "nguồn ảnh": null
    }
  ],
  "Đề 2": [...]
}
```

### Ví dụ với ảnh

```json
{
  "Câu": "Q. 5: Câu hỏi có hình ảnh?",
  "các đáp án": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "đáp án đúng": "B. ...",
  "nguồn ảnh": null // Tự động tìm img/q5.png
}
```

hoặc chỉ định đường dẫn:

```json
{
  "nguồn ảnh": "img/diagram/special-q5.png"
}
```

### Ví dụ với xuống dòng

```json
{
  "Câu": "Q. 10: Câu hỏi có nhiều ý: i) Ý thứ nhất. ii) Ý thứ hai. iii) Ý thứ ba.",
  "các đáp án": [...],
  "đáp án đúng": "..."
}
```

## 🎨 Giao diện

### Màu sắc

- **Primary**: Purple gradient (#667eea → #764ba2)
- **Success**: Green (#48bb78)
- **Error**: Red (#f56565)
- **Background**: White cards with shadow

### Typography

- **Font**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Code**: Courier New (cho code trong câu hỏi)

### Responsive

- ✅ Desktop (> 768px)
- ✅ Tablet (768px)
- ✅ Mobile (< 768px)

## 🔧 Tùy chỉnh

### Thay đổi số câu mỗi trang

Trong `app.js`, dòng 2:

```javascript
const ITEMS_PER_PAGE = 20; // Thay đổi số này
```

### Thêm đề thi mới

Thêm vào `quiz.json`:

```json
{
  "Đề 1": [...],
  "Đề 2": [...],
  "Đề 3 (Mới)": [
    // Thêm câu hỏi ở đây
  ]
}
```

### Thêm định dạng ảnh mới

Trong `app.js`, hàm `tryAlternativeImageFormats`:

```javascript
const formats = ["png", "jpg", "jpeg", "gif", "webp", "svg"]; // Thêm format
```

## 📊 Thống kê

- **Hỗ trợ**: Không giới hạn số đề thi
- **Hiệu năng**: Tối ưu với phân trang
- **Tương thích**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🐛 Xử lý lỗi

### Không load được ảnh

- Kiểm tra đường dẫn file trong thư mục `img/`
- Đảm bảo tên file khớp với số câu (vd: `q1.png` cho Q.1)
- Kiểm tra định dạng file được hỗ trợ

### Không hiển thị câu hỏi

- Kiểm tra cấu trúc JSON hợp lệ
- Đảm bảo chạy qua web server (không mở file:// trực tiếp)
- Kiểm tra Console (F12) để xem lỗi

### Styling không đúng

- Xóa cache trình duyệt (Ctrl+F5)
- Kiểm tra file `style.css` đã load

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phát hành cho mục đích học tập.

## 👨‍💻 Tác giả

**PhatDo04**

- GitHub: [@PhatDo04](https://github.com/PhatDo04)

## 🙏 Acknowledgments

- Bootstrap 5.3.3 cho UI components
- Font Awesome cho icons
- Inspiration từ ISTQB Sample Papers

---

⭐ Nếu bạn thấy dự án này hữu ích, hãy cho nó một ngôi sao nhé!
