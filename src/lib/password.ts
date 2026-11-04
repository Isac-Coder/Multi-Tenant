import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

function deriveKey(password: string, salt: string, keyLength: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt, 64);
  return `${salt}:${key.toString("hex")}`;
}

export function generateTemporaryPassword(): string {
  return randomBytes(18).toString("base64url");
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, keyHex] = storedHash.split(":");
  if (!salt || !keyHex || !/^[a-f0-9]+$/i.test(keyHex)) return false;

  const expectedKey = Buffer.from(keyHex, "hex");
  const actualKey = await deriveKey(password, salt, expectedKey.length);
  return expectedKey.length === actualKey.length && timingSafeEqual(actualKey, expectedKey);
}