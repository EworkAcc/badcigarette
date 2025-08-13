import { NextRequest } from 'next/server';
import connectDB from './connectDB';
import { GoogleUser } from '@/models/googleUsers';
import User from '@/models/User';

export interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  loginType: 'standard' | 'google';
  termsOfServiceAccepted?: boolean;
  privacyPolicyAccepted?: boolean;
  dataSellingConsent?: boolean;
  consentDate?: string;
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
          loginType: 'google',
          termsOfServiceAccepted: dbUser.termsOfServiceAccepted,
          privacyPolicyAccepted: dbUser.privacyPolicyAccepted,
          dataSellingConsent: dbUser.dataSellingConsent,
          consentDate: dbUser.consentDate?.toISOString()
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
          loginType: 'standard',
          termsOfServiceAccepted: dbUser.termsOfServiceAccepted,
          privacyPolicyAccepted: dbUser.privacyPolicyAccepted,
          dataSellingConsent: dbUser.dataSellingConsent,
          consentDate: dbUser.consentDate?.toISOString()
        };
      }
    }
   
    return null;
  } catch (error) {
    console.error('Error getting fresh user data:', error);
    throw error;
  }
};

export const getAuthCookie = async (request: NextRequest): Promise<UserData | null> => {
  try {
    const cookieValue = request.cookies.get('auth_user')?.value;
    if (!cookieValue) return null;
   
    const userData = JSON.parse(cookieValue) as UserData;
    
    const userExists = await validateUserExists(userData);
    if (!userExists) {
      return null;
    }
    
    return userData;
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
    return null;
  }
};

export const hasUserConsentedToDataSelling = (userData: UserData | null): boolean => {
  if (!userData) return false;
  return userData.dataSellingConsent === true;
};

export const hasUserAcceptedTermsAndPrivacy = (userData: UserData | null): boolean => {
  if (!userData) return false;
  return userData.termsOfServiceAccepted === true && userData.privacyPolicyAccepted === true;
};

export const getUserConsentStatus = (userData: UserData | null) => {
  if (!userData) {
    return {
      hasConsent: false,
      termsAccepted: false,
      privacyAccepted: false,
      dataSellingConsent: false,
      consentDate: null
    };
  }

  return {
    hasConsent: hasUserAcceptedTermsAndPrivacy(userData),
    termsAccepted: userData.termsOfServiceAccepted === true,
    privacyAccepted: userData.privacyPolicyAccepted === true,
    dataSellingConsent: userData.dataSellingConsent === true,
    consentDate: userData.consentDate || null
  };
};

export const updateUserConsent = async (
  userData: UserData,
  consentUpdates: {
    dataSellingConsent?: boolean;
    termsOfServiceAccepted?: boolean;
    privacyPolicyAccepted?: boolean;
  }
): Promise<boolean> => {
  try {
    await connectDB();
    
    const updateData = {
      ...consentUpdates,
      consentDate: new Date()
    };

    let result;
    
    if (userData.loginType === 'google') {
      result = await GoogleUser.findByIdAndUpdate(
        userData.id,
        updateData,
        { new: true }
      );
    } else {
      result = await User.findByIdAndUpdate(
        userData.id,
        updateData,
        { new: true }
      );
    }
    
    return result !== null;
  } catch (error) {
    console.error('Error updating user consent:', error);
    throw error;
  }
};

export const userNeedsConsentUpdate = async (userData: UserData): Promise<boolean> => {
  try {
    await connectDB();
   
    let dbUser = null;
   
    if (userData.loginType === 'google') {
      dbUser = await GoogleUser.findById(userData.id);
    } else {
      dbUser = await User.findById(userData.id);
    }
   
    if (!dbUser) return false;
    
    return (
      dbUser.termsOfServiceAccepted === undefined ||
      dbUser.privacyPolicyAccepted === undefined ||
      dbUser.dataSellingConsent === undefined
    );
  } catch (error) {
    console.error('Error checking consent status:', error);
    return false;
  }
};