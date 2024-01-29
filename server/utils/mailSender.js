
require('dotenv').config();

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  REDIRECT_URI
);
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
console.log("oAuth2Client credentials set");
exports.mailSender = async (email, title, body) => {
  try {
    console.log("Before fetching accesstokens");
    const accessToken = await oAuth2Client.getAccessToken();
    console.log("Access Token", accessToken)
    const transport = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "v1i2k3askumarpatel@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `Studynotion | CodeHelp" <${process.env.USER_EMAIL}>`,
      to: email,
      subject: title,
      text: `${body}`,
      // html: body,
    };
    console.log("Before sending mails")
    const result = await transport.sendMail(mailOptions);
    console.log("Result after sending mails: ", result);
    return result;
  } catch (error) {
    console.log(error)
    return error;
  }
};