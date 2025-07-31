import crypto from 'crypto';

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const getVerificationExpiry = (): Date => {
  return new Date(Date.now() + 5 * 60 * 1000);
};