# Hướng dẫn cấu hình Email Service

## 1. Cấu hình Gmail App Password

### Bước 1: Bật 2-Factor Authentication
1. Truy cập [Google Account Security](https://myaccount.google.com/security)
2. Bật "2-Step Verification" nếu chưa bật

### Bước 2: Tạo App Password
1. Vào [App Passwords](https://myaccount.google.com/apppasswords)
2. Chọn "Mail" và "Other (custom name)"
3. Nhập tên: "Reuzel E-commerce"
4. Copy mật khẩu 16 ký tự được tạo

### Bước 3: Cấu hình .env
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-digit-app-password
```

## 2. Test Email Service

### Sử dụng API endpoint:
```bash
curl -X POST http://localhost:3001/api/test/send-test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "recipient@example.com"}'
```

### Hoặc chạy test script:
```bash
node test-email.js
```

## 3. Email Templates

### Email được gửi khi:
- ✅ Thanh toán VNPay thành công
- ✅ Đặt hàng COD thành công
- ✅ Đơn hàng được xác nhận

### Template bao gồm:
- 📧 Header với logo Reuzel
- 📋 Thông tin đơn hàng
- 🛍️ Danh sách sản phẩm với hình ảnh
- 💰 Tổng tiền
- 🚚 Thông tin giao hàng
- 📞 Thông tin liên hệ hỗ trợ

## 4. Troubleshooting

### Lỗi thường gặp:
1. **"Invalid login"**: Kiểm tra EMAIL_USER và EMAIL_PASS
2. **"Less secure app access"**: Sử dụng App Password thay vì mật khẩu thường
3. **"Connection timeout"**: Kiểm tra kết nối internet

### Debug:
- Kiểm tra console logs khi gửi email
- Test với API endpoint `/api/test/send-test-email`
- Kiểm tra spam folder của email nhận

## 5. Production Setup

### Khuyến nghị:
- Sử dụng email service chuyên nghiệp (SendGrid, AWS SES)
- Cấu hình SPF, DKIM records
- Monitor email delivery rates
- Backup email templates
