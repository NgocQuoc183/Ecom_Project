const { sendPaymentSuccessEmail } = require('./services/emailService');

// Test data
const testOrderData = {
  order: {
    id: 123,
    total_amount: 500000,
    payment_method: 'vnpay',
    recipient_name: 'Nguyen Van Test',
    recipient_phone: '0123456789',
    shipping_address: '123 Test Street, Test City',
    created_at: new Date()
  },
  user: {
    name: 'Nguyen Van Test',
    email: 'test@example.com' // Thay bằng email thật để test
  },
  orderItems: [
    {
      name: 'Reuzel Blue Pomade',
      quantity: 1,
      price: 250000,
      image: 'https://product.hstatic.net/200000424613/product/reuzel_blue_pomade_4oz_113g_master.jpg'
    },
    {
      name: 'Reuzel Grooming Tonic',
      quantity: 2,
      price: 125000,
      image: 'https://product.hstatic.net/200000424613/product/reuzel__grooming_tonic_3.38oz_100ml_master.jpg'
    }
  ]
};

// Test gửi email
async function testEmail() {
  try {
    console.log('🧪 Testing email service...');
    const result = await sendPaymentSuccessEmail(testOrderData);
    
    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Test email failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing email:', error.message);
  }
}

// Chạy test nếu file được gọi trực tiếp
if (require.main === module) {
  testEmail();
}

module.exports = { testEmail };
