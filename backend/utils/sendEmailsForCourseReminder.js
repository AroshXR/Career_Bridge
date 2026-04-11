import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
import cron from "node-cron";
import ResponseGenerator from "./ResponseGenerator.js";

configDotenv();

// 1. Core function to send the email
export const sendEmailsForReminder = async (mto, mSubject, html) => {
  const mailServer = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
      // Do not fail on invalid certs
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