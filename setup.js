/**
 * Quick setup helper — generates strong JWT secrets and writes them to .env
 * Run with: node setup.js
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let env = fs.readFileSync(envPath, 'utf-8');

const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');

env = env.replace('REPLACE_WITH_YOUR_STRONG_64_CHAR_SECRET_HERE_USE_NODE_CRYPTO', jwtSecret);
env = env.replace('REPLACE_WITH_A_DIFFERENT_STRONG_64_CHAR_SECRET_HERE', jwtRefreshSecret);

fs.writeFileSync(envPath, env);
console.log('✅ JWT secrets generated and written to .env');
console.log('');
console.log('Next step: edit .env and replace REPLACE_WITH_YOUR_ANTHROPIC_API_KEY');
console.log('  with your actual API key from https://console.anthropic.com');
console.log('');
console.log('Then run:  npm run dev');
