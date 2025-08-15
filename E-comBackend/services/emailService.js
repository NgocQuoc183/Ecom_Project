const nodemailer = require('nodemailer');

/**
 * Email Service - Gửi email thông báo
 */

// Cấu hình transporter (sử dụng Gmail hoặc test account)
const createTransporter = async () => {
  console.log('🔧 Creating email transporter...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');

  // Nếu có Gmail credentials, sử dụng Gmail
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('📧 Using Gmail SMTP');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Nếu không có, tạo test account với Ethereal
    console.log('🧪 Creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    console.log('✅ Ethereal account created:', testAccount.user);

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
};

// Template email thanh toán thành công
const createPaymentSuccessTemplate = (orderData) => {
  const { order, user, orderItems } = orderData;
  
  const itemsHtml = orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image || 'https://via.placeholder.com/60'}" 
             alt="${item.name}" 
             style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <small>Số lượng: ${item.quantity}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thanh toán thành công - Reuzel</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #8B4513; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        .order-info { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .total { font-size: 18px; font-weight: bold; color: #8B4513; }
        .success-icon { font-size: 48px; color: #28a745; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 THANH TOÁN THÀNH CÔNG</h1>
          <p>Cảm ơn bạn đã mua hàng tại Reuzel!</p>
        </div>
        
        <div class="content">
          <div style="text-align: center;">
            <div class="success-icon">✅</div>
            <h2>Xin chào ${user.name}!</h2>
            <p>Đơn hàng của bạn đã được thanh toán thành công và đang được xử lý.</p>
          </div>
          
          <div class="order-info">
            <h3>📋 Thông tin đơn hàng</h3>
            <p><strong>Mã đơn hàng:</strong> #${order.id}</p>
            <p><strong>Ngày đặt:</strong> ${new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
            <p><strong>Phương thức thanh toán:</strong> ${order.payment_method === 'vnpay' ? 'VNPay' : 'Tiền mặt'}</p>
            <p><strong>Trạng thái:</strong> <span style="color: #28a745;">Đã thanh toán</span></p>
          </div>

          <h3>🛍️ Sản phẩm đã mua</h3>
          <table class="items-table">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 10px; text-align: left;">Hình ảnh</th>
                <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                <th style="padding: 10px; text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; margin-top: 20px;">
            <p class="total">Tổng cộng: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}</p>
          </div>

          <div class="order-info">
            <h3>🚚 Thông tin giao hàng</h3>
            <p><strong>Người nhận:</strong> ${order.recipient_name}</p>
            <p><strong>Số điện thoại:</strong> ${order.recipient_phone}</p>
            <p><strong>Địa chỉ:</strong> ${order.shipping_address}</p>
          </div>

          <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4>📞 Cần hỗ trợ?</h4>
            <p>Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ:</p>
            <p>📧 Email: support@reuzel.vn</p>
            <p>📱 Hotline: 1900-xxxx</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Cảm ơn bạn đã tin tưởng và lựa chọn Reuzel!</p>
          <p><small>Email này được gửi tự động, vui lòng không reply.</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Gửi email thanh toán thành công
const sendPaymentSuccessEmail = async (orderData) => {
  try {
    const transporter = await createTransporter();
    const { user, order } = orderData;

    const mailOptions = {
      from: {
        name: 'Reuzel Store',
        address: process.env.EMAIL_USER || 'noreply@reuzel.vn'
      },
      to: user.email,
      subject: `✅ Thanh toán thành công - Đơn hàng #${order.id}`,
      html: createPaymentSuccessTemplate(orderData)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);

    // Nếu sử dụng Ethereal, log preview URL
    if (result.messageId && !process.env.EMAIL_USER) {
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(result));
    }

    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Gửi email xác nhận đơn hàng
const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const transporter = await createTransporter();
    const { user, order } = orderData;

    const mailOptions = {
      from: {
        name: 'Reuzel Store',
        address: process.env.EMAIL_USER || 'noreply@reuzel.vn'
      },
      to: user.email,
      subject: `📦 Xác nhận đơn hàng #${order.id} - Reuzel`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Xác nhận đơn hàng</h2>
          <p>Xin chào ${user.name},</p>
          <p>Đơn hàng #${order.id} của bạn đã được xác nhận và đang được chuẩn bị.</p>
          <p>Chúng tôi sẽ thông báo khi đơn hàng được giao cho đơn vị vận chuyển.</p>
          <p>Cảm ơn bạn đã mua hàng tại Reuzel!</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPaymentSuccessEmail,
  sendOrderConfirmationEmail
};
