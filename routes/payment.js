const router = require('express').Router()
const moment = require("moment");
const crypto = require("crypto");

router.get('/create_payment_url', (req, res) => {
    try {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;


        const tmnCode = "MQJXTOUR";
        const secretKey = "YYMGZVGHRKQSXZATIRROSXBVORRKAFTI";
        let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        const returnUrl = "https://e-commercial1234.herokuapp.com/";

        const date = new Date();

        const createDate = moment(date, "YYYYMMDD");
        const orderId = '' + (new Date()).getTime();
        const amount = "1231";
        const bankCode = "VNBANK";

        const orderInfo = "Thanh+toan+don+hang+%3A5";
        const orderType = "other";
        let locale = "vn";
        const currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Amount'] = amount * 100;
        if (bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params['vnp_CreateDate'] = "20170829103111";
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_Locale'] = locale;

        vnp_Params['vnp_OrderInfo'] = "test";
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_TxnRef'] = "235543";

        const querystring = require('qs');
        const signData = querystring.stringify(vnp_Params, {encode: true});
        console.log(signData)
        const hmac = crypto.createHmac("sha256", secretKey);
        vnp_Params['vnp_SecureHash'] = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnpUrl += '?' + querystring.stringify(vnp_Params, {encode: true});
        return res.json({url: vnpUrl})
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
});

module.exports = router

const getDateFormat = (date) =>{
    let mm = date.getMonth() + 1; // getMonth() is zero-based
    let dd = date.getDate();

    return [date.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('');
}