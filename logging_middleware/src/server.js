import app from './app.js';
import env from './config/env.js';
import { register } from './services/register.js';
import { authenticate, setAccessToken } from './services/auth.js';
import { info } from './services/logger.js';

async function performRegistration() {
  
  console.log('STEP 1: REGISTRATION WITH AFFORDMED SERVER');
  

  if (env.CLIENT_ID && env.CLIENT_SECRET) {
    console.log('CLIENT_ID and CLIENT_SECRET already exist in .env');
    console.log('   Skipping registration (already registered once)');
    return true;
  }

  const userData = {
    email: env.EMAIL,
    name: env.NAME,
    mobileNo: env.MOBILE_NO,
    githubUsername: env.GITHUB_USERNAME,
    rollNo: env.ROLL_NO,
    accessCode: env.ACCESS_CODE
  };

  if (!userData.email || !userData.name || !userData.rollNo || !userData.accessCode) {
    console.error(
      'Error: Please fill all required fields in .env (EMAIL, NAME, ROLL_NO, ACCESS_CODE)'
    );
    return false;
  }

  const result = await register(userData);

  if (!result.success) {
    console.error('Registration failed');
    return false;
  }

  console.log(
    'IMPORTANT: Save these credentials in .env for next run:'
  );
  console.log(`   CLIENT_ID=${result.data.clientID}`);
  console.log(`   CLIENT_SECRET=${result.data.clientSecret}`);

  return true;
}

async function performAuthentication() {
  
  console.log('STEP 2: AUTHENTICATION WITH AFFORDMED SERVER');
  

  const authData = {
    email: env.EMAIL,
    name: env.NAME,
    rollNo: env.ROLL_NO,
    accessCode: env.ACCESS_CODE,
    clientID: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET
  };

  if (!authData.clientID || !authData.clientSecret) {
    console.error('Error: CLIENT_ID and CLIENT_SECRET not available');
    return false;
  }

  const result = await authenticate(authData);

  if (!result.success) {
    console.error('Authentication failed');
    return false;
  }

  setAccessToken(result.data.access_token);
  await info('service', 'Authentication successful');

  return true;
}

async function testLoggingMiddleware() {
  
  console.log('STEP 3: TESTING LOGGING MIDDLEWARE');
  

  console.log('📝 Testing logging middleware with sample requests...\n');

  const mockReq = {
    method: 'GET',
    originalUrl: '/api/health'
  };

  await info('middleware', `${mockReq.method} ${mockReq.originalUrl}`);

  const mockReq2 = {
    method: 'POST',
    originalUrl: '/api/logs'
  };

  await info('middleware', `${mockReq2.method} ${mockReq2.originalUrl}`);

  console.log('Logging middleware tests completed');
}

async function main() {
  
  console.log('LOGGING MIDDLEWARE SERVICE STARTED');
  

  const regResult = await performRegistration();
  if (!regResult) {
    console.error('Registration failed. Exiting.');
    process.exit(1);
  }

  const authResult = await performAuthentication();
  if (!authResult) {
    console.error('Authentication failed. Exiting.');
    process.exit(1);
  }

  await testLoggingMiddleware();

  
  console.log('STARTING EXPRESS SERVER');
  

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
    console.log(`Health check: http://localhost:${env.PORT}/api/health`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
  });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
