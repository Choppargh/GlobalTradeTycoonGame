import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface AuthUser {
  id: number;
  username: string;
  authType: 'google' | 'guest';
  googleId?: string;
  email?: string;
  deviceId?: string;
}

export interface JWTPayload {
  userId: number;
  username: string;
  authType: 'google' | 'guest';
}

// Verify Google ID token
export async function verifyGoogleToken(token: string): Promise<{
  googleId: string;
  email: string;
  name: string;
} | null> {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) return null;
    
    return {
      googleId: payload.sub,
      email: payload.email || '',
      name: payload.name || payload.email || 'User'
    };
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return null;
  }
}

// Generate device-based fingerprint for guest users
export function generateDeviceId(userAgent?: string, ip?: string): string {
  const data = `${userAgent || 'unknown'}-${ip || 'unknown'}-${Date.now()}`;
  return uuidv4() + '-' + Buffer.from(data).toString('base64').slice(0, 16);
}

// Generate JWT token for authenticated users
export function generateJWT(user: AuthUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
    authType: user.authType
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d' // Long-lived for game sessions
  });
}

// Verify JWT token
export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
  } catch (error) {
    return null;
  }
}