import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv();

export const sendEmailsForReminder = async (mto, mSubject, html) => {
  const mailServer = nodemailer.createTransport({
    host: "smtp.googlemail.com",
    port: 587,
    secure: true,
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const info = await mailServer.sendMail({
      from: process.env.FROM_EMAIL,
      to: mto,
      subject: mSubject,
      html: html
    });
    console.log("Email sent: " + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("Error while sending E-mail:", err.message);
    return { success: false, error: err.message };
  }
};