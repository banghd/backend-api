var axios = require('axios');
var data = JSON.stringify({
    "sender": {
        "name": "Admin thue tro",
        "email": "minhbangod@gmail.com.com"
    },
    "to": [
        {
            "email": "testmail@example.com",
            "name": "John Doe"
        }
    ],
    "subject": "test mail",
    "htmlContent": "<html><head></head><body><h1>Hello this is a test email from sib</h1></body></html>",
    "headers": {
        "X-Mailin-custom": "custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3",
        "charset": "iso-8859-1"
    }
});

var config = {
    method: 'post',
    url: 'https://api.sendinblue.com/v3/smtp/email',
    headers: {
        'accept': 'application/json',
        'api-key': 'YOUR_API_KEY',
        'content-type': 'application/json'
    },
    data : data
};

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
