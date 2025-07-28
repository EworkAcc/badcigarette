import connectDB from './connectDB';
import { GoogleUser } from '@/models/googleUsers';
import User from '@/models/User';

export interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  loginType: 'standard' | 'google';
}

export const validateUserExists = async (userData: UserData): Promise<boolean> => {
  try {
    await connectDB();
   
    let dbUser = null;
   
    if (userData.loginType === 'google') {
      dbUser = await GoogleUser.findOne({
        $or: [
          { _id: userData.id },
          { email: userData.email }
        ]
      });
    } else {
      dbUser = await User.findOne({
        $or: [
          { _id: userData.id },
          { email: userData.email }
        ]
      });
    }
   
    return dbUser !== null;
  } catch (error) {
    console.error('Error validating user existence:', error);
    throw error;
  }
};

export const getFreshUserData = async (userData: UserData): Promise<UserData | null> => {
  try {
    await connectDB();
   
    let dbUser = null;
   
    if (userData.loginType === 'google') {
      dbUser = await GoogleUser.findOne({
        $or: [
          { _id: userData.id },
          { email: userData.email }
        ]
      });
      
      if (dbUser) {
        return {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.image || undefined,
          loginType: 'google'
        };
      }
    } else {
      dbUser = await User.findOne({
        $or: [
          { _id: userData.id },
          { email: userData.email }
        ]
      });
      
      if (dbUser) {
        return {
          id: dbUser._id.toString(),
          name: `${dbUser.fname} ${dbUser.lname}`,
          email: dbUser.email,
          image: dbUser.image || undefined,
          loginType: 'standard'
        };
      }
    }
   
    return null;
  } catch (error) {
    console.error('Error getting fresh user data:', error);
    throw error;
  }
};