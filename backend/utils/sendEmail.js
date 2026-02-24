import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
  try {
    await sgMail.send({
      to,
      from: process.env.FROM_EMAIL,
      subject,
      text,
      html,
    });
    console.log("Email sent to", to);
  } catch (error) {
    console.error(error);
  }
};

//send emails