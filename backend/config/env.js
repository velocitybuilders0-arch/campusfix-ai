const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Variables that the backend needs for its intended features to work.
const recommended = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missing = recommended.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.warn(
    `[env] Warning: missing environment variables: ${missing.join(', ')}. ` +
      'Database and auth features will not work until these are set.'
  );
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
};

module.exports = env;
