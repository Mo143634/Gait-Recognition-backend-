import axios from 'axios';
import fs from 'node:fs';
import { deleteFile } from '../../utils/file/fileActions.js';

import { downloadFile } from '../../utils/file/download.js';

/**
 * Predict using Hugging Face Space model
 * @param {Object} file - Multer file object or downloaded file object {path, originalname, mimetype}
 * @returns {Promise<Object>} - Response from AI model
 */
export const predictModel = async (file) => {
    const spaceUrl = process.env.HF_SPACE_URL || 'https://mohamed6262-gait-1.hf.space/predict';
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    const isMockEnabled = process.env.ENABLE_AI_MOCK === 'true';

    // Mock Mode Check
    if (isMockEnabled) {
        console.warn('⚠️ Running in MOCK MODE for HF Space (Explicitly enabled).');
        
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Delete temporary file
        if (file.path) deleteFile(file.path);

        return {
            status: "mocked",
            model: "Gait-Recognition-Base",
            feature_vector: Array.from({length: 512}, () => Number(Math.random().toFixed(4))),
            prediction: "Normal Gait Patterns Detected",
            confidence: 0.94,
            message: "This is a mock response because ENABLE_AI_MOCK is true.",
            timestamp: new Date().toISOString()
        };
    }

    try {
        console.log(`🚀 Sending request to Public AI Model: ${spaceUrl}`);
        
        // Create FormData for the request
        const formData = new FormData();
        
        // Read file content as a Blob/File for axios FormData compatibility
        const fileContent = fs.readFileSync(file.path);
        const blob = new Blob([fileContent], { type: file.mimetype });
        formData.append('file', blob, file.originalname);

        const headers = {};
        if (apiKey && apiKey !== 'your_api_key_here') {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await axios.post(
            spaceUrl,
            formData,
            {
                headers: headers,
                timeout: 90000 // 90 second timeout for AI processing
            }
        );

        // Success - clean up the file
        deleteFile(file.path);

        const result = response.data;
        
        // Ensure feature_vector is an array of numbers
        if (result.feature_vector && !Array.isArray(result.feature_vector)) {
            try {
                result.feature_vector = JSON.parse(result.feature_vector);
            } catch (e) {
                console.warn("Failed to parse feature_vector:", e.message);
            }
        }

        return {
            prediction: result.prediction || result.label || "Analysis Complete",
            confidence: result.confidence || result.score || 0,
            feature_vector: result.feature_vector || [],
            raw_response: result
        };

    } catch (error) {
        // Clean up the file on error too
        if (file.path && fs.existsSync(file.path)) {
            deleteFile(file.path);
        }

        const status = error.response?.status;
        const errorData = error.response?.data;

        console.error('🔥 HF Space API Error:', {
            status,
            error: errorData,
            spaceUrl
        });

        if (status === 401 || status === 403) {
            throw new Error(`Authentication failed. Please check your HUGGINGFACE_API_KEY. (Status ${status})`);
        }

        if (status === 404) {
            throw new Error(`Endpoint not found: "${spaceUrl}". Please verify the HF_SPACE_URL in your .env (Status 404)`);
        }

        if (error.code === 'ECONNABORTED') {
            throw new Error('AI Model request timed out. The model might be processing a large file or is under high load.');
        }

        throw new Error(
            errorData?.detail ||
            errorData?.message ||
            error.message ||
            'Hugging Face Space API failed'
        );
    }
};

/**
 * Predict using a video URL
 * @param {string} url - Video URL
 * @returns {Promise<Object>} - Response from AI model
 */
export const predictModelByUrl = async (url) => {
    // 1. Download file to temp storage
    const file = await downloadFile(url);
    
    // 2. Perform prediction
    return await predictModel(file);
};