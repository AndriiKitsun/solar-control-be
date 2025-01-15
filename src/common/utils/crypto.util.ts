import {
  createHash,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from 'node:crypto';

let secret: string;
let algorithm: string;
let key: string;
let iv: Buffer;

export function initCrypto(): void {
  secret = process.env.AUTH_ENCODING_KEY!;
  algorithm = process.env.AUTH_ENCODING_ALGORITHM!;

  key = createHash('sha512').update(secret).digest('hex').substring(0, 32);
  iv = randomBytes(16);
}

export function encrypt(data: string): string {
  const cipher = createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(data, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + encrypted;
}

export function decrypt(data: string): string {
  const inputIV = data.slice(0, 32);
  const encrypted = data.slice(32);
  const decipher = createDecipheriv(
    algorithm,
    Buffer.from(key),
    Buffer.from(inputIV, 'hex'),
  );

  return decipher.update(encrypted, 'hex', 'utf-8');
}
