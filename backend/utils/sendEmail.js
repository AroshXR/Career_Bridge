import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.googlemail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: `"Career Bridge" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully via Nodemailer to", to);
  } catch (error) {
    console.error("❌ Nodemailer Failed to send email:", error.message);
  }
};