const { execSync } = require('child_process');

try {
  // Install dependencies for both frontend and backend
  console.log('Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('Installing backend dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });

  // Build the frontend
  console.log('Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}