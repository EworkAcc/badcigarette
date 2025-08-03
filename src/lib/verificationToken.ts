import crypto from 'crypto';

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const getVerificationExpiry = (): Date => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const getPasswordResetExpiry = (): Date => {
  return new Date(Date.now() + 15 * 60 * 1000);
};