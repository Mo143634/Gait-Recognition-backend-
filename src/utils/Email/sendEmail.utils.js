import nodemailer from"nodemailer";


export async function sendEmail({to="", subject="Gait Recognition Application", text="", html="", cc="", bcc="", attachments=[]}) 
{
    const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // Default to false for TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    });

    const info = await transporter.sendMail({
        from: `"Gait Recognition App" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
        cc,
        bcc,
        attachments,
    });

    console.log("Message sent:", info.messageId);
};

export const emailSubject = {
    confirmEmail: "Confirm Your Email",
    resetPassword:"Reset Your Password",
    welcome:"Welcome To Gait Recognition"
}