const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envFilePath = path.join(__dirname, '.env');

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

// Read the existing content of the .env file
const existingContent = fs.readFileSync(envFilePath, 'utf-8');

// Create a regular expression to match the JWT_SECRET line
const jwtSecretRegex = /^JWT_SECRET=/m;

// Check if JWT_SECRET already exists in the .env file
if (jwtSecretRegex.test(existingContent)) {
  // Update the existing JWT_SECRET line
  const updatedContent = existingContent.replace(jwtSecretRegex, `JWT_SECRET=${secretKey}`);
  
  // Write the updated content back to the .env file
  fs.writeFileSync(envFilePath, updatedContent);

  console.log('JWT_SECRET updated in .env file.');
} else {
  // If JWT_SECRET doesn't exist, add it to the end of the file
  fs.appendFileSync(envFilePath, `\nJWT_SECRET=${secretKey}\n`);

  console.log('JWT_SECRET added to .env file.');
}
