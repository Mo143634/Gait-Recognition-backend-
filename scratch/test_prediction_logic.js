import { predictModel } from '../src/modules/prediction/prediction.service.js';
import { predictValidation } from '../src/modules/prediction/prediction.validation.js';
import joi from 'joi';

async function test() {
    process.env.HUGGINGFACE_API_KEY = "test_key";
    
    console.log("--- Testing Validation ---");
    const validData = { body: { input: "test input" } };
    const invalidData = { body: { input: "" } };
    
    // Simulate validation
    const schema = predictValidation.body;
    const result1 = schema.validate(validData.body);
    console.log("Valid input validation:", result1.error ? "FAILED" : "PASSED");
    
    const result2 = schema.validate(invalidData.body);
    console.log("Empty input validation:", result2.error ? "PASSED (Rejected as expected)" : "FAILED (Accepted empty input)");

    console.log("\n--- Testing Service Logic (Offline) ---");
    try {
        console.log("Calling predictModel with no API KEY...");
        delete process.env.HUGGINGFACE_API_KEY;
        await predictModel("test");
    } catch (e) {
        console.log("Caught expected error:", e.message);
    }
}

test();
