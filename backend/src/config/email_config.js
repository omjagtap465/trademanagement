import { createTransport } from "nodemailer";
const transporter = createTransport({
  service: "Gmail",

  auth: {
    user: process.env.EMAIL_NODEMAILER,
    pass: process.env.EMAIL_NODEMAILER_PASSWORD,
  },
});
export { transporter };
