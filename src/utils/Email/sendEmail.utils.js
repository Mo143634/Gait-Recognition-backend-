import nodemailer from"nodemailer";


export async function sendEmail({to="", subject="Gait Recognition Application", text="", html="", cc="", bcc="", attachments=[]}) 
{
    const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    });

    const info = await transporter.sendMail({
        from: `"Gait Recognition App" <${process.env.EMAIL_USER}>`,
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