import * as dotenv from "dotenv";
import path from "node:path";
import { sendEmail } from "../src/utils/Email/sendEmail.utils.js";

dotenv.config({ path: path.resolve(".env") });

async function testEmail() {
    console.log("Starting FIXED email test...");
    console.log("SMTP_HOST:", process.env.SMTP_HOST || "Default (smtp.gmail.com)");
    console.log("SMTP_PORT:", process.env.SMTP_PORT || "Default (587)");
    console.log("SMTP_USER:", process.env.SMTP_USER ? "Set" : "Not Set");
    console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "Set" : "Not Set");
    console.log("EMAIL_FROM:", process.env.EMAIL_FROM ? "Set" : "Not Set");

    try {
        await sendEmail({
            to: process.env.SMTP_USER || "test@example.com", 
            subject: "Test OTP Email (Fixed)",
            text: "This is a test email to verify the connection with correct variable names.",
            html: "<b>This is a test email to verify the connection with correct variable names.</b>",
        });
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Failed to send email:");
        console.error(error);
    }
}

testEmail();
