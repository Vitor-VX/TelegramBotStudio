require('dotenv').config();
const sgMail = require('@sendgrid/mail');

async function sendEmail(emailTo, tittleSubject, msgP) {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: emailTo,
            from: 'JoxsBot@gmail.com',
            subject: tittleSubject,
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>JoxsBot</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        background-color: #000;
                    }
                    .container {
                        max-width: 600px;
                        margin: auto;
                        padding: 20px;
                        text-align: center;
                    }
                    .header {
                        color: black;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    .box {
                        background-color: black;
                        border: 2px solid #d3d3d3;
                        border-radius: 10px;
                        padding: 20px;
                        color: #fff;
                    }
                    .text {
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Obrigado por confiar na JoxsBot!</div>
                    <div class="box">
                        <div class="text">${msgP}</div>
                    </div>
                </div>
            </body>
            </html>
            `,
        };
        return sgMail.send(msg);
    } catch (error) {
        console.log(error);
    }
}