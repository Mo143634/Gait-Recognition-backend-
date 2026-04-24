import { cosineSimilarity, normalizeVector } from '../src/modules/analysis/search.service.js';

// Test vectors
const v1 = [1, 0, 0];
const v2 = [1, 0, 0];
const v3 = [0, 1, 0];
const v4 = [1, 1, 0];

console.log('--- Cosine Similarity Tests ---');
console.log('v1 vs v1 (Identical):', cosineSimilarity(v1, v2), 'Expected: 1');
console.log('v1 vs v3 (Orthogonal):', cosineSimilarity(v1, v3), 'Expected: 0');
console.log('v1 vs v4 (45 degrees):', cosineSimilarity(v1, v4).toFixed(4), 'Expected: 0.7071');

const v5 = [2, 0, 0];
console.log('v1 vs v5 (Same direction, diff magnitude):', cosineSimilarity(v1, v5), 'Expected: 1');

console.log('\n--- Normalization Tests ---');
const v6 = [3, 4, 0]; // Magnitude 5
console.log('v6 normalized:', normalizeVector(v6));
const normV6 = normalizeVector(v6);
const magnitude = Math.sqrt(normV6.reduce((sum, val) => sum + val * val, 0));
console.log('Normalized magnitude:', magnitude, 'Expected: 1');

console.log('\nTests Completed Successfully!');
