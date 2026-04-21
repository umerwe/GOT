// scripts/inject-env.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');


const serviceWorkerPath = path.join(__dirname, '../public/firebase-messaging-sw.js');

// Read the original service worker
let content = fs.readFileSync(serviceWorkerPath, 'utf8');

// Replace placeholders with actual environment variables
const replacements = {
  '{{NEXT_PUBLIC_FIREBASE_API_KEY}}': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  '{{NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}}': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  '{{NEXT_PUBLIC_FIREBASE_PROJECT_ID}}': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  '{{NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}}': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  '{{NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}}': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  '{{NEXT_PUBLIC_FIREBASE_APP_ID}}': process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
// Apply replacements
Object.entries(replacements).forEach(([placeholder, value]) => {
  if (!value) {
    process.exit(1);
  }
  content = content.replace(new RegExp(placeholder, 'g'), value);
});

// Write the updated service worker
fs.writeFileSync(serviceWorkerPath, content);
