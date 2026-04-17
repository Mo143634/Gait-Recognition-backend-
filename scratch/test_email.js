import * as dotenv from "dotenv";
import path from "node:path";
import { sendEmail } from "../src/utils/Email/sendEmail.utils.js";

dotenv.config({ path: path.resolve(".env") });

async function testEmail() {
    console.log("Starting email test...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not Set");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not Set");

    try {
        await sendEmail({
            to: process.env.EMAIL_USER, // Send to self for testing
            subject: "Test OTP Email",
            text: "This is a test email to verify the connection.",
            html: "<b>This is a test email to verify the connection.</b>",
        });
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Failed to send email:");
        console.error(error);
    }
}

testEmail();
