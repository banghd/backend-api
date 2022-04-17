exports.generateResetMail = (name, token) => {
    let link = "https://e-commercial1234.herokuapp.com/thay-doi-mat-khau?token=" + token
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="
    width: 100%;
    font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    padding: 0;
    margin: 0;
  ">

<head>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta content="telephone=no" name="format-detection" />
    <title>New email template 2022-04-16</title>
    <style type="text/css">
        .reset-email-password {
            width: 600px;
            height: 1000px;
            margin: 0 auto;
        }
        
        .reset-email-password .header {
            width: 100%;
            height: 100px;
            background: rgb(203 216 169 / 37%);
        }
        
        .reset-email-password .content {
            width: 100%;
        }
        
        .reset-email-password .footer {
            width: 100%;
            height: 120px;
            background: rgb(203 216 169 / 37%);
        }
    </style>
</head>

<body>
    <div class="reset-email-password">
        <div class="header">
            <img style="
            width: 170px;
            height: 80px;
            object-fit: cover;
            margin: 15px 20px;
          " src="https://e-commercial1234.herokuapp.com/img/logo.c1a5b400.png" alt="" />
        </div>
        <div class="content">
            <div class="image">
                <img style="
              width: 175px;
              height: 208px;
              display: block;
              margin: 40px auto;
            " src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt="" />
            </div>
            <div class="title" style="
            font-weight: bold;
            font-family: initial;
            text-align: center;
            font-size: 20px;
          ">
                FORGOT YOUR PASSWORD
            </div>
            <div class="title" style="
            text-align: center;
            font-size: 18px;
            margin: 25px 0 50px 0;
            font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
          ">
                <p>Xin chào ${name}</p>
                <p>Bạn đang yêu cầu thay đổi mật khẩu tài khoản</p>
            </div>
            <div class="link" style="text-align:center">
                <p>Để cấp lại mật khẩu, Vui lòng click vào đường dẫn dưới đây</p>
                <a href=${link} style="text-decoration: none; font-weight: bold; color: #3d5ca3">
                    <div style="border: 2px solid #3d5ca3; width: 180px;padding: 10px;border-radius:10px; margin: 30px auto;">RESET PASSWORD
                    </div>
                </a>
            </div>
            <div class="footer">
                <div class="content" style="padding: 20px;font-family: arial, 'helvetica neue', helvetica, sans-serif;font-weight: bold;">
                    <div class="question">Bạn cần trợ giúp?</div>
                    <div style="width:400px; font-weight:normal; margin-top:20px">Mọi thắc mắc xin vui lòng liên hệ hòm mail 18020853@vnu.edu.vn để được hỗ trợ và giải đáp.
                    </div>
                </div>
            </div>
        </div>
</body>

</html>

</html>`
}
