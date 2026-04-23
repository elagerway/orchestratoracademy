import { OAuth } from 'oauth';
import { readFileSync } from 'fs';

const env = {};
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  env.X_API_KEY,
  env.X_API_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'
);

oauth.get(
  'https://api.twitter.com/2/users/me',
  env.X_ACCESS_TOKEN,
  env.X_ACCESS_TOKEN_SECRET,
  (err, data) => {
    if (err) {
      console.error('FAIL status=' + err.statusCode);
      console.error(err.data || err);
      process.exit(1);
    }
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    console.log('OK:', JSON.stringify(parsed, null, 2));
  }
);
