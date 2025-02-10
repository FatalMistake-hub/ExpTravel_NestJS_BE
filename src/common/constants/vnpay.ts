export const Common = {
  // Environment variables should be stored in a .env file and accessed via process.env
  VNP_CODE: 'IE5GYO20',
  VNP_HASH_SECRET: 'YDBASKPWKOUYOAEXUCHVEMWSOHUXFZOF',
  VNP_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',

  SUCCESS: 'success',
  FAILURE: 'failure',

  getCurrentDateTime: new Date(),
};
// https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000&vnp_Command=pay&vnp_CreateDate=20250210170444&vnp_CurrCode=VND&vnp_ExpireDate=20250210173444&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=PAYMENT%20TOUR&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Fexperience-travel.vercel.app%2Ftrips&vnp_TmnCode=IE5GYO20&vnp_TxnRef=403ab3f0-9b6f-40b3-bebd-30bff15691ae&vnp_Version=2.1.0&vnp_SecureHash=f8ea081a10c73b457cb3090f412d09a0e9e0326d3437c67061a9f310cf39602c6df40454787fd2276be5e11a8291597d5895cf53d45acce0a120f761043ce5fb



