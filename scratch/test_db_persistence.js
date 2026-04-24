import mongoose from 'mongoose';
import { GaitAnalysisModel } from '../src/modules/analysis/analysis.model.js';
import * as dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve('.env') });

const testPersistence = async () => {
    try {
        console.log('Connecting to DB:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const dummyEmbedding = Array.from({ length: 128 }, () => Math.random());
        
        const testAnalysis = new GaitAnalysisModel({
            user_id: new mongoose.Types.ObjectId(),
            gait_profile_id: new mongoose.Types.ObjectId(),
            status: 'completed',
            embedding: dummyEmbedding
        });

        await testAnalysis.save();
        console.log('Saved analysis with embedding. ID:', testAnalysis._id);

        const retrieved = await GaitAnalysisModel.findById(testAnalysis._id);
        console.log('Retrieved embedding length:', retrieved.embedding.length);
        
        if (retrieved.embedding.length === 128) {
            console.log('Persistence test PASSED!');
        } else {
            console.log('Persistence test FAILED!');
        }

        // Cleanup
        await GaitAnalysisModel.findByIdAndDelete(testAnalysis._id);
        console.log('Test record cleaned up.');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error during persistence test:', error);
        process.exit(1);
    }
};

testPersistence();
