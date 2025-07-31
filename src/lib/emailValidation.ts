import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import { GoogleUser } from '@/models/googleUsers';

export interface EmailCheckResult {
  exists: boolean;
  source: 'google' | 'domestic' | null;
  userId?: string;
  isVerified?: boolean;
}

export async function checkEmailExists(email: string): Promise<EmailCheckResult> {
  try {
    await connectDB();
    
    const normalizedEmail = email.toLowerCase().trim();
    
    const googleUser = await GoogleUser.findOne({ email: normalizedEmail });
    if (googleUser) {
      return {
        exists: true,
        source: 'google',
        userId: googleUser.id,
        isVerified: true 
      };
    }
    
    const domesticUser = await User.findOne({ email: normalizedEmail });
    if (domesticUser) {
      return {
        exists: true,
        source: 'domestic',
        userId: domesticUser.id,
        isVerified: domesticUser.isEmailVerified || false
      };
    }
    
    return {
      exists: false,
      source: null
    };
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw new Error('Database error while checking email');
  }
}