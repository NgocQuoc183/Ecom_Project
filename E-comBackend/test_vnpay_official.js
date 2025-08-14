const crypto = require('crypto');

// Test theo đúng VNPay documentation
function testOfficialVnpayFormat() {
  const config = {
    vnp_TmnCode: 'KWTK20IN',
    vnp_HashSecret: 'QD2K9WUQ2JG7B7W2YMUC1JPUHTXOEXOV',
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ReturnUrl: 'http://localhost:3001/api/payment/vnpay-callback'
  };

  // Tạo timestamp hiện tại
  const now = new Date();
  const createDate = now.getFullYear() + 
    String(now.getMonth() + 1).padStart(2, '0') + 
    String(now.getDate()).padStart(2, '0') + 
    String(now.getHours()).padStart(2, '0') + 
    String(now.getMinutes()).padStart(2, '0') + 
    String(now.getSeconds()).padStart(2, '0');

  // Tham số theo VNPay spec
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = config.vnp_TmnCode;
  vnp_Params['vnp_Locale'] = 'vn';
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = '48';
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang 48';
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = 26000;
  vnp_Params['vnp_ReturnUrl'] = config.vnp_ReturnUrl;
  vnp_Params['vnp_IpAddr'] = '127.0.0.1';
  vnp_Params['vnp_CreateDate'] = createDate;

  console.log('=== Official VNPay Format Test ===');
  console.log('Params before sorting:', vnp_Params);

  // Sắp xếp theo alphabet
  vnp_Params = sortObject(vnp_Params);
  console.log('Params after sorting:', vnp_Params);

  // Tạo query string
  let signData = '';
  let keys = Object.keys(vnp_Params);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (i == 0) {
      signData = key + "=" + vnp_Params[key];
    } else {
      signData += '&' + key + "=" + vnp_Params[key];
    }
  }

  console.log('Sign data:', signData);

  // Tạo secure hash
  let hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;

  console.log('Signature:', signed);

  // Tạo URL
  let querystring = '';
  let sortedKeys = Object.keys(vnp_Params).sort();
  for (let i = 0; i < sortedKeys.length; i++) {
    let key = sortedKeys[i];
    if (i == 0) {
      querystring = key + "=" + encodeURIComponent(vnp_Params[key]);
    } else {
      querystring += '&' + key + "=" + encodeURIComponent(vnp_Params[key]);
    }
  }

  let vnpUrl = config.vnp_Url + "?" + querystring;
  console.log('Final URL:', vnpUrl);

  return vnpUrl;
}

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[decodeURIComponent(str[key])] = encodeURIComponent(obj[decodeURIComponent(str[key])]).replace(/%20/g, "+");
  }
  return sorted;
}

const testUrl = testOfficialVnpayFormat();
console.log('\n=== Test this URL ===');
console.log(testUrl);
