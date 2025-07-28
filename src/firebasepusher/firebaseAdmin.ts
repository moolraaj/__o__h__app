import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_KEY_PATH!;
  const absolutePath = path.resolve(serviceAccountPath);
  const serviceAccount = JSON.parse(
    fs.readFileSync(absolutePath, 'utf-8')
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
