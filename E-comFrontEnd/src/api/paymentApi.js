const API_URL = '/api/payment';

// Tạo đơn hàng và thanh toán
export const createOrderAndPayment = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/create-order-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Lỗi tạo đơn hàng');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating order and payment:', error);
    throw error;
  }
};

// Tạo URL thanh toán VNPay
export const createVnpayPaymentUrl = async (paymentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/vnpay/create-payment-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Lỗi tạo URL thanh toán');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating VNPay payment URL:', error);
    throw error;
  }
};

// Kiểm tra trạng thái thanh toán
export const checkPaymentStatus = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/status/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Lỗi kiểm tra trạng thái thanh toán');
    }
    
    return data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};
