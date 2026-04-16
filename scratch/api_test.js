import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

async function testAPI() {
    console.log('--- Starting API Verification ---');
    
    try {
        // 1. Health Check
        console.log('\n[1/3] Testing Health Check...');
        const healthRes = await axios.get(`http://localhost:${PORT}/`);
        console.log('✅ Health Check Success:', healthRes.data.message);

        // 2. Auth Routes (Basic Check)
        console.log('\n[2/3] Testing Auth (Refresh Token - expected 401 without cookie/header)...');
        try {
            await axios.get(`${BASE_URL}/auth/refresh-token`);
        } catch (error) {
            if (error.response?.status === 400 || error.response?.status === 401) {
                console.log('✅ Auth Endpoint reachable (returned expected auth error)');
            } else {
                console.error('❌ Auth Endpoint failed unexpectedly:', error.message);
            }
        }

        // 3. Static Path Check
        console.log('\n[3/3] Checking Static Path resolution...');
        // We can't easily check a real file without uploading, but we can check if /uploads is reachable
        try {
            const staticRes = await axios.get(`http://localhost:${PORT}/uploads/nonexistent_file_test`);
            console.log('Static path check returned:', staticRes.status);
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Static path correctly configured (returned 404 for missing file)');
            } else {
                console.error('❌ Static path issue:', error.message);
            }
        }

        console.log('\n--- Verification Finished ---');
    } catch (error) {
        console.error('\n❌ Critical Failure:', error.message);
        console.log('\nNote: Make sure the server is RUNNING (npm run dev) before running this test.');
    }
}

testAPI();
