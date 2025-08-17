import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

function generateKlingJWT() {
  const accessKey = process.env.KLING_ACCESS_KEY || 'Agh4gC3EmdEk3nC49nTREefKRJPp3nap';
  const secretKey = process.env.KLING_SECRET_KEY || 'fRRRp9pMafafQArtLRarNGNkaBDktpgH';

  const headers = {
    alg: "HS256",
    typ: "JWT"
  };
  
  const currentTime = Math.floor(Date.now() / 1000);
  const payload = {
    iss: accessKey,
    exp: currentTime + 1800, // 30 minutes from now
    nbf: currentTime - 5     // 5 seconds ago
  };

  const token = jwt.sign(payload, secretKey, { header: headers });
  
  console.log('🔑 Generated JWT Token for Kling AI:');
  console.log(token);
  console.log('\n📋 Copy this token and paste it in the Kling AI platform');
  console.log('⏰ Token expires in 30 minutes');
  
  return token;
}

generateKlingJWT();