import nodemailer from "nodemailer";

export const sendOTP = async (toEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `GiziCare <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Kode OTP Verifikasi GiziCare",
      html: `
        <div style="font-family: sans-serif; line-height:1.4">
          <h3>Kode OTP Anda</h3>
          <p>Gunakan kode berikut untuk memverifikasi akun Anda. Berlaku 5 menit.</p>
          <h2>${otp}</h2>
          <p>Jika Anda tidak meminta kode ini, abaikan email ini.</p>
        </div>
      `
    });

    console.log("EMAIL SENT:", info.response);
    return true;
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return false;
  }
};
