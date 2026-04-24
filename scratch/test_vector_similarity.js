import { cosineSimilarity, normalizeVector } from '../src/modules/analysis/search.service.js';

// Test vectors
const v1 = [1, 2, 3];
const v2 = [1, 2, 3]; // Exact match
const v3 = [0, 0, 0]; // Zero vector
const v4 = [-1, -2, -3]; // Opposite vector
const v5 = [1, 0, 0];
const v6 = [0, 1, 0]; // Orthogonal

console.log("--- Vector Similarity Tests ---");

console.log(`v1 vs v2 (Exact Match): ${cosineSimilarity(v1, v2)} (Expected: 1)`);
console.log(`v1 vs v4 (Opposite): ${cosineSimilarity(v1, v4)} (Expected: -1)`);
console.log(`v5 vs v6 (Orthogonal): ${cosineSimilarity(v5, v6)} (Expected: 0)`);
console.log(`v1 vs v3 (Zero vector): ${cosineSimilarity(v1, v3)} (Expected: 0)`);

const vA = [3, 4];
const normA = normalizeVector(vA);
console.log(`Normalization of [3, 4]: [${normA}] (Expected: [0.6, 0.8])`);
console.log(`Magnitude of normalized vector: ${Math.sqrt(normA[0]**2 + normA[1]**2)} (Expected: 1)`);

// Test with realistic data (small scale)
const personA_v1 = [0.1, 0.2, 0.3, 0.4];
const personA_v2 = [0.11, 0.21, 0.31, 0.41]; // Very similar
const personB_v1 = [0.9, 0.1, 0.1, 0.1]; // Very different

console.log(`Person A vs Person A (Similar): ${cosineSimilarity(personA_v1, personA_v2)}`);
console.log(`Person A vs Person B (Different): ${cosineSimilarity(personA_v1, personB_v1)}`);

console.log("--- End of Tests ---");
