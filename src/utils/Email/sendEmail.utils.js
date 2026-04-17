import nodemailer from"nodemailer";


export async function sendEmail({to="", subject="Gait Recognition", text="", html="", cc="", bcc="", attachments=[]}) 
{
    const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
    });

    const info = await transporter.sendMail({
        from: `"Gait Recognition" <${process.env.EMAIL}>`,
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