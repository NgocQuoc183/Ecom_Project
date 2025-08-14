const crypto = require('crypto');

// Test VNPay signature generation
const testVnpaySignature = () => {
  const vnpayConfig = {
    vnp_TmnCode: 'KWTK20IN',
    vnp_HashSecret: 'QD2K9WUQ2JG7B7W2YMUC1JPUHTXOEXOV'
  };

  // Test data
  const vnpParams = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: '43',
    vnp_OrderInfo: 'Thanh toan don hang 43',
    vnp_OrderType: 'other',
    vnp_Amount: '26000',
    vnp_ReturnUrl: 'http://localhost:3001/api/payment/vnpay-callback',
    vnp_IpAddr: '::1',
    vnp_CreateDate: '20250815035022'
  };

  console.log('=== VNPay Signature Test ===');
  console.log('Input params:', vnpParams);

  // Sort parameters
  const sortedKeys = Object.keys(vnpParams).sort();
  const sortedParams = {};
  sortedKeys.forEach(key => {
    sortedParams[key] = vnpParams[key];
  });

  console.log('Sorted params:', sortedParams);

  // Create sign data
  const signData = Object.keys(sortedParams)
    .map(key => `${key}=${sortedParams[key]}`)
    .join('&');

  console.log('Sign data:', signData);

  // Create signature
  const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
  const signature = hmac.update(signData, 'utf-8').digest('hex');

  console.log('Generated signature:', signature);
  console.log('Expected signature: 8736d59b681ec387199889b91becf043fcaf9045763e95668a717e815271b72f2...');

  // Test with URL encoding
  const signDataEncoded = Object.keys(sortedParams)
    .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
    .join('&');

  console.log('Sign data (encoded):', signDataEncoded);

  const hmacEncoded = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
  const signatureEncoded = hmacEncoded.update(signDataEncoded, 'utf-8').digest('hex');

  console.log('Generated signature (encoded):', signatureEncoded);
};

testVnpaySignature();
