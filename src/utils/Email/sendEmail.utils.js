import nodemailer from"nodemailer";


export async function sendEmail({to="", subject="saraha application", text="", html="", cc="", bcc="", attachments=[]}) 
{
    const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
    });

    const info = await transporter.sendMail({
        from: `"Saraha_App" <${process.env.EMAIL}>`,
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
    welcome:"Welcome To Saraha APP"
}