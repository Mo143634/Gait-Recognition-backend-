import * as predictionService from '../src/modules/prediction/prediction.service.js';
import * as dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

dotenv.config({ path: path.resolve('.env') });

const testModelConnection = async () => {
    // Check if we have an API key (even if it's the placeholder, we want to see what happens)
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    console.log('Using API Key:', apiKey === 'your_api_key_here' ? '[PLACEHOLDER]' : 'MATCHED');

    // Create a dummy file for testing
    const dummyFilePath = 'uploads/test_dummy.txt';
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    fs.writeFileSync(dummyFilePath, 'dummy video content');

    const mockFile = {
        path: dummyFilePath,
        originalname: 'test_dummy.txt',
        mimetype: 'video/mp4'
    };

    try {
        console.log('Attempting to call the real AI model...');
        // We temporarily force ENABLE_AI_MOCK to false for this test
        process.env.ENABLE_AI_MOCK = 'false';
        
        const result = await predictionService.predictModel(mockFile);
        console.log('Success! Result:', result);
    } catch (error) {
        console.error('Connection Test Failed (as expected if no real key):');
        console.error('Error Message:', error.message);
    } finally {
        if (fs.existsSync(dummyFilePath)) fs.unlinkSync(dummyFilePath);
    }
};

testModelConnection();
