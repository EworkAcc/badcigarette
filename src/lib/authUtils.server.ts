import connectDB from './connectDB';
import { GoogleUser } from '../models/googleUsers';
import User from '../models/User';

export interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  loginType: 'standard' | 'google';
}

/**
 * Validates if a user still exists in the database (SERVER-SIDE ONLY)
 * @param userData - User data from cookie
 * @returns Promise<boolean> - true if user exists, false otherwise
 */
export const validateUserExists = async (userData: UserData): Promise<boolean> => {
  try {
    await connectDB();
   
    let dbUser = null;
   
    if (userData.loginType === 'google') {
      dbUser = await GoogleUser.findById(userData.id);
    } else {
      dbUser = await User.findById(userData.id);
    }
   
    return dbUser !== null;
  } catch (error) {
    console.error('Error validating user existence:', error);
    return false;
  }
};