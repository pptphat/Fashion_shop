const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.ENV_USERNAME,
            pass: process.env.ENV_PASSWORD,
        },
    });

    const mailOptions = {
        from: "Crepp so gud",
        to: options.email,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        else console.log("Sent:" + info.response);
    });
};

module.exports = sendMail;
