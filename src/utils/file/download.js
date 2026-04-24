import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import { nanoid } from 'nanoid';

/**
 * Downloads a file from a URL to a temporary local path
 * @param {string} url - URL of the file to download
 * @param {string} directory - Directory to save the file in
 * @returns {Promise<Object>} - Object containing path, originalname, and mimetype
 */
export const downloadFile = async (url, directory = 'uploads/temp') => {
    try {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        const extension = path.extname(new URL(url).pathname) || '.mp4';
        const filename = `${nanoid()}${extension}`;
        const filePath = path.join(directory, filename);

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve({
                path: filePath,
                originalname: filename,
                mimetype: response.headers['content-type'] || 'video/mp4'
            }));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download file from ${url}:`, error.message);
        throw new Error(`Failed to retrieve video from storage: ${error.message}`);
    }
};
