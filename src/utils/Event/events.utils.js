import { EventEmitter } from "node:events";
import { login_successfuly_template } from "../../Templates/Login_Successfuly_Email.js";
import { template } from "../../Templates/Email_OTP.js";
import { emailSubject, sendEmail } from "../Email/sendEmail.utils.js";

export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail", async (data) => {
    await sendEmail({
        to: data.to,
        text: "Hello From Gait Recognition App",
        html: template(data.otp,data.fullname),
        subject: emailSubject.confirmEmail,
    });
});


emailEvent.on("LoginSuccessfuly", async (data) => {
    await sendEmail({
        to: data.to,
        subject: emailSubject.login,
        text: `Welcome back ${data.fullname}`,
        html: login_successfuly_template(data.fullname),
    });
});

emailEvent.on("forgetPassword", async (data) => {
    await sendEmail({
        to: data.to,
        subject: emailSubject.resetPassword,
        text: `Welcome back ${data.fullname}`,
        html: template(data.otp,data.fullname,emailSubject.resetPassword),
    });
});