export const template = (otp, fullname, subject = "Verify Your Email") => {
  return `
    <html>
      <body>
        <h1>${subject}</h1>
        <p>Hello ${fullname},</p>
        <p>Your verification code is:</p>
        <h2 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 5px;">
          ${otp}
        </h2>
        <p>This code will expire in 2 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br>Gait Recognition Team</p>
      </body>
    </html>
  `;
};
