import { createHash } from 'crypto';

export async function hash(password: string): Promise<string> {
  return createHash('sha256').update(password).digest('hex');
}

export async function verify(password: string, hashedPassword: string): Promise<boolean> {
  const passwordHash = await hash(password);
  return passwordHash === hashedPassword;
}