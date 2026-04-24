import { GaitProfileModel } from "../gait/gait.model.js";

/**
 * Calculate Cosine Similarity between two vectors
 * @param {number[]} a 
 * @param {number[]} b 
 * @returns {number} Similarity score (0 to 1)
 */
export const cosineSimilarity = (a, b) => {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) return 0;
    
    return dotProduct / magnitude;
};

/**
 * Normalize a vector to unit length
 * @param {number[]} vector 
 * @returns {number[]} Normalized vector
 */
export const normalizeVector = (vector) => {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vector;
    return vector.map(val => val / magnitude);
};

/**
 * Find similar gait profiles based on input vector
 * @param {number[]} inputVector 
 * @param {number} topK 
 * @returns {Promise<Array>} List of matches
 */
export const findSimilarGait = async (inputVector, topK = 5) => {
    const useAtlas = process.env.USE_ATLAS_VECTOR_SEARCH === 'true';
    const threshold = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.85');

    if (useAtlas) {
        console.log("🔍 Using MongoDB Atlas Vector Search...");
        // MongoDB Atlas Vector Search aggregation
        return await GaitProfileModel.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index", // Must be created in Atlas
                    "path": "embedding",
                    "queryVector": inputVector,
                    "numCandidates": topK * 10,
                    "limit": topK
                }
            },
            {
                "$project": {
                    "profileId": "$_id",
                    "user_id": 1,
                    "file_name": 1,
                    "condition": 1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            },
            {
                "$match": {
                    "score": { "$gte": threshold }
                }
            }
        ]);
    } else {
        console.log("🔍 Using Local Cosine Similarity Fallback...");
        // Fetch all profiles with embeddings
        const profiles = await GaitProfileModel.find({ 
            embedding: { $exists: true, $ne: [] } 
        }).select('_id user_id file_name condition embedding');

        const matches = profiles.map(profile => {
            const score = cosineSimilarity(inputVector, profile.embedding);
            return {
                profileId: profile._id,
                user_id: profile.user_id,
                file_name: profile.file_name,
                condition: profile.condition,
                score: parseFloat(score.toFixed(4))
            };
        });

        // Sort by score descending and filter by threshold
        return matches
            .filter(m => m.score >= threshold)
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }
};
