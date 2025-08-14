const crypto = require('crypto');

// Test VNPay signature với credentials thực
const testVnpaySignature = () => {
  const config = {
    tmnCode: 'KWTK20IN',
    hashSecret: 'QD2K9WUQ2JG7B7W2YMUC1JPUHTXOEXOV'
  };

  // Test params giống như VNPay documentation
  const params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: config.tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: '47',
    vnp_OrderInfo: 'Thanh toan don hang 47',
    vnp_OrderType: 'other',
    vnp_Amount: '26000',
    vnp_ReturnUrl: 'http://localhost:3001/api/payment/vnpay-callback',
    vnp_IpAddr: '::1',
    vnp_CreateDate: '20250815041500'
  };

  console.log('=== VNPay Signature Debug ===');
  console.log('Config:', config);
  console.log('Input params:', params);

  // Method 1: Theo documentation VNPay
  const sortedKeys = Object.keys(params).sort();
  console.log('Sorted keys:', sortedKeys);

  const signData1 = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  console.log('Sign data (method 1):', signData1);

  const hmac1 = crypto.createHmac('sha512', config.hashSecret);
  const signature1 = hmac1.update(signData1, 'utf-8').digest('hex');
  console.log('Signature (method 1):', signature1);

  // Method 2: Với querystring
  const querystring = require('querystring');
  const sortedParams = {};
  sortedKeys.forEach(key => {
    sortedParams[key] = params[key];
  });

  const signData2 = querystring.stringify(sortedParams, { encode: false });
  console.log('Sign data (method 2):', signData2);

  const hmac2 = crypto.createHmac('sha512', config.hashSecret);
  const signature2 = hmac2.update(signData2, 'utf-8').digest('hex');
  console.log('Signature (method 2):', signature2);

  // Method 3: Với Buffer
  const hmac3 = crypto.createHmac('sha512', config.hashSecret);
  const signature3 = hmac3.update(Buffer.from(signData1, 'utf-8')).digest('hex');
  console.log('Signature (method 3 - Buffer):', signature3);

  // Test URL
  const finalParams = { ...params, vnp_SecureHash: signature1 };
  const finalSortedKeys = Object.keys(finalParams).sort();
  const queryString = finalSortedKeys
    .map(key => `${key}=${encodeURIComponent(finalParams[key])}`)
    .join('&');
  
  const testUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${queryString}`;
  console.log('\nTest URL:', testUrl);
};

testVnpaySignature();
