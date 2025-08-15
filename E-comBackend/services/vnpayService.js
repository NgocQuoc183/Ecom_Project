const crypto = require('crypto');

/**
 * VNPay Service - Xử lý thanh toán VNPay theo chuẩn Node.js
 */
class VnPayService {
  constructor() {
    // Validate required environment variables
    this.validateConfig();

    this.config = {
      tmnCode: process.env.VNPAY_TMN_CODE,
      hashSecret: process.env.VNPAY_HASH_SECRET,
      url: process.env.VNPAY_BASE_URL,
      returnUrl: process.env.VNPAY_RETURN_URL,
      version: process.env.VNPAY_VERSION || '2.1.0',
      command: process.env.VNPAY_COMMAND || 'pay',
      currCode: process.env.VNPAY_CURR_CODE || 'VND',
      locale: process.env.VNPAY_LOCALE || 'vn'
    };
  }

  /**
   * Validate VNPay configuration
   */
  validateConfig() {
    const required = ['VNPAY_TMN_CODE', 'VNPAY_HASH_SECRET', 'VNPAY_BASE_URL', 'VNPAY_RETURN_URL'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing VNPay configuration: ${missing.join(', ')}`);
    }
  }

  /**
   * Tạo URL thanh toán VNPay
   * @param {Object} paymentData - Dữ liệu thanh toán
   * @param {string} ipAddr - Địa chỉ IP của client
   * @returns {string} URL thanh toán VNPay
   */
  createPaymentUrl(paymentData, ipAddr) {
    try {
      const { orderId, amount, orderDescription, orderType = 'other', bankCode } = paymentData;

      // Validate input
      if (!orderId || !amount || !orderDescription) {
        throw new Error('Missing required payment data: orderId, amount, orderDescription');
      }

      // Tạo timestamp
      const createDate = this.formatDate(new Date());

      // Tạo các tham số thanh toán
      const vnpParams = {
        vnp_Version: this.config.version,
        vnp_Command: this.config.command,
        vnp_TmnCode: this.config.tmnCode,
        vnp_Locale: this.config.locale,
        vnp_CurrCode: this.config.currCode,
        vnp_TxnRef: String(orderId),
        vnp_OrderInfo: orderDescription,
        vnp_OrderType: orderType,
        vnp_Amount: String(amount * 100), // VNPay yêu cầu amount * 100
        vnp_ReturnUrl: this.config.returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate
      };

      // Thêm bank code nếu có
      if (bankCode) {
        vnpParams.vnp_BankCode = bankCode;
      }

      // Tạo chữ ký và URL
      return this.buildPaymentUrl(vnpParams);

    } catch (error) {
      console.error('Error creating VNPay payment URL:', error);
      throw error;
    }
  }

  /**
   * Xây dựng URL thanh toán với chữ ký theo VNPay spec
   * @param {Object} params - Tham số thanh toán
   * @returns {string} URL thanh toán hoàn chỉnh
   */
  buildPaymentUrl(params) {
    // Tạo chữ ký với params chưa có signature
    const signature = this.createSignature(params);

    // Thêm signature vào params
    const finalParams = { ...params, vnp_SecureHash: signature };

    // Tạo query string - không double encode vì sortParams đã encode rồi
    const sortedParams = this.sortParams(finalParams);
    const queryString = Object.keys(sortedParams)
      .map(key => `${key}=${sortedParams[key]}`)
      .join('&');

    const fullUrl = `${this.config.url}?${queryString}`;
    console.log('Final VNPay URL:', fullUrl);

    return fullUrl;
  }

  /**
   * Xác thực callback từ VNPay
   * @param {Object} vnpParams - Tham số callback từ VNPay
   * @returns {boolean} Kết quả xác thực
   */
  verifyReturnUrl(vnpParams) {
    try {
      const receivedSignature = vnpParams.vnp_SecureHash;

      if (!receivedSignature) {
        console.error('Missing vnp_SecureHash in callback');
        return false;
      }

      // Tạo bản copy để không thay đổi object gốc
      const paramsToVerify = { ...vnpParams };
      delete paramsToVerify.vnp_SecureHash;
      delete paramsToVerify.vnp_SecureHashType;

      // Tạo chữ ký để so sánh
      const expectedSignature = this.createSignature(paramsToVerify);

      console.log('VNPay Callback Verification:');
      console.log('Expected Signature:', expectedSignature);
      console.log('Received Signature:', receivedSignature);

      return receivedSignature === expectedSignature;

    } catch (error) {
      console.error('Error verifying VNPay callback:', error);
      return false;
    }
  }

  /**
   * Xử lý response từ VNPay
   * @param {Object} vnpParams - Tham số callback từ VNPay
   * @returns {Object} Kết quả xử lý
   */
  processVnpayReturn(vnpParams) {
    try {
      const isValidSignature = this.verifyReturnUrl({ ...vnpParams });
      const responseCode = vnpParams.vnp_ResponseCode;

      const result = {
        success: false,
        code: responseCode,
        message: this.getResponseMessage(responseCode),
        data: null
      };

      if (!isValidSignature) {
        result.message = 'Chữ ký không hợp lệ';
        return result;
      }

      if (responseCode === '00') {
        result.success = true;
        result.data = {
          orderId: vnpParams.vnp_TxnRef,
          amount: this.parseAmount(vnpParams.vnp_Amount),
          orderInfo: vnpParams.vnp_OrderInfo,
          transactionNo: vnpParams.vnp_TransactionNo,
          bankCode: vnpParams.vnp_BankCode,
          payDate: vnpParams.vnp_PayDate,
          transactionStatus: vnpParams.vnp_TransactionStatus
        };
      }

      return result;

    } catch (error) {
      console.error('Error processing VNPay return:', error);
      return {
        success: false,
        code: '99',
        message: 'Lỗi xử lý kết quả thanh toán',
        data: null
      };
    }
  }

  /**
   * Tạo chữ ký HMAC SHA512 theo đúng spec VNPay
   * @param {Object} params - Tham số cần ký
   * @returns {string} Chữ ký hex
   */
  createSignature(params) {
    // Sắp xếp và encode params theo VNPay spec
    const sortedParams = this.sortParams(params);

    // Tạo sign data string theo format: key1=value1&key2=value2
    const signDataParts = [];
    for (const key of Object.keys(sortedParams)) {
      signDataParts.push(`${key}=${sortedParams[key]}`);
    }
    const signData = signDataParts.join('&');

    console.log('VNPay Sign Data:', signData);

    // Tạo HMAC SHA512 - VNPay yêu cầu hash secret là string, không phải Buffer
    const hmac = crypto.createHmac('sha512', this.config.hashSecret);
    const signature = hmac.update(signData, 'utf8').digest('hex');

    console.log('VNPay Signature:', signature);

    return signature;
  }

  /**
   * Sắp xếp tham số theo VNPay spec (với encoding)
   * @param {Object} params - Tham số cần sắp xếp
   * @returns {Object} Tham số đã sắp xếp và encode
   */
  sortParams(params) {
    const sorted = {};

    // Lấy tất cả keys và sort theo alphabet
    const keys = Object.keys(params).sort();

    // Tạo sorted object với values đã encode đúng spec VNPay
    for (const key of keys) {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        // VNPay yêu cầu encode UTF-8 và replace space thành +
        sorted[key] = encodeURIComponent(params[key])
          .replace(/%20/g, '+')
          .replace(/%21/g, '!')
          .replace(/%27/g, "'")
          .replace(/%28/g, '(')
          .replace(/%29/g, ')')
          .replace(/%2A/g, '*');
      }
    }

    return sorted;
  }

  /**
   * Format date theo định dạng VNPay (YYYYMMDDHHmmss) - GMT+7
   * @param {Date} date - Ngày cần format
   * @returns {string} Chuỗi ngày đã format
   */
  formatDate(date) {
    // VNPay yêu cầu timezone GMT+7 (Vietnam)
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));

    const year = vietnamTime.getUTCFullYear();
    const month = String(vietnamTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(vietnamTime.getUTCDate()).padStart(2, '0');
    const hours = String(vietnamTime.getUTCHours()).padStart(2, '0');
    const minutes = String(vietnamTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(vietnamTime.getUTCSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  /**
   * Parse amount từ VNPay (chia cho 100)
   * @param {string} amount - Amount từ VNPay
   * @returns {number} Amount thực tế
   */
  parseAmount(amount) {
    return parseInt(amount) / 100;
  }

  /**
   * Lấy IP address từ request
   * @param {Object} req - Express request object
   * @returns {string} IP address
   */
  getClientIpAddress(req) {
    return req.headers['x-forwarded-for'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           '127.0.0.1';
  }

  /**
   * Lấy message từ response code
   * @param {string} responseCode - Mã response từ VNPay
   * @returns {string} Message tương ứng
   */
  getResponseMessage(responseCode) {
    const messages = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    };

    return messages[responseCode] || 'Lỗi không xác định';
  }
}

module.exports = VnPayService;
