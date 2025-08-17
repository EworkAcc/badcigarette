import { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import connectDB from '@/lib/connectDB';
import { GoogleUser } from '@/models/googleUsers';
import { checkEmailExists } from '@/lib/emailValidation';

import NextAuth from 'next-auth';

const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          if (!user.email) {
            console.log('Google sign-in failed: No email provided');
            return false;
          }

          const emailCheck = await checkEmailExists(user.email);
          
          if (emailCheck.exists && emailCheck.source === 'domestic') {
            console.log(`Google login blocked: Email ${user.email} already has domestic account`);
            return '/signon?error=EmailExistsWithDifferentProvider';
          }
          
          await connectDB();
          
          const existingUser = await GoogleUser.findOne({ 
            email: user.email 
          });

          if (existingUser) {
            if (!existingUser.termsOfServiceAccepted || !existingUser.privacyPolicyAccepted) {
              console.log(`Google user ${user.email} needs to provide consent`);
              
              const pendingUserData = {
                googleId: account.providerAccountId,
                email: user.email,
                name: user.name,
                image: user.image
              };

              await storePendingGoogleUser(user.email, pendingUserData);
              
              return `/signon?error=GoogleConsentRequired&email=${encodeURIComponent(user.email)}`;
            }
            
            const dbUser = await GoogleUser.findOneAndUpdate(
              { email: user.email },
              {
                name: user.name,
                image: user.image,
                googleId: account.providerAccountId
              },
              { new: true }
            );
            
            user.id = dbUser._id.toString();
            return true;
          } else {
            console.log(`New Google user ${user.email} needs to provide consent`);
            
            const pendingUserData = {
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image
            };

            await storePendingGoogleUser(user.email, pendingUserData);
            
            return `/signon?error=GoogleConsentRequired&email=${encodeURIComponent(user.email)}`;
          }
        } catch (error) {
          console.error('Error during Google sign-in:', error);
          return '/signon?error=GoogleSignInError'; 
        }
      }
      return true;
    },
    
    async jwt({ token, account, user }) {
      if (account?.provider === 'google' && user) {
        token.userId = user.id;
        token.loginType = 'google';
      }
      return token;
    },
    
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user?.email) {
        try {
          await connectDB();
          const dbUser = await GoogleUser.findOne({ 
            email: session.user.email 
          });
          
          if (dbUser) {
            return {
              ...session,
              user: {
                ...session.user,
                id: dbUser._id.toString(),
                image: dbUser.image || session.user.image,
                loginType: 'google'
              }
            };
          }
        } catch (error) {
          console.error("Error fetching user from database in session callback:", error);
        }
      }
      return session;
    }
  },

  pages: {
    signIn: '/signon', 
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  
  cookies: {
    sessionToken: {
      name: process.env.NEXT_PUBLIC_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NEXT_PUBLIC_ENV === 'production', 
      },
    },
    callbackUrl: {
      name: process.env.NEXT_PUBLIC_ENV === 'production' 
        ? '__Secure-next-auth.callback-url' 
        : 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NEXT_PUBLIC_ENV === 'production', 
      },
    },
    csrfToken: {
      name: process.env.NEXT_PUBLIC_ENV === 'production' 
        ? '__Host-next-auth.csrf-token' 
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NEXT_PUBLIC_ENV === 'production', 
      },
    },
    state: {
      name: 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NEXT_PUBLIC_ENV === 'production', 
        maxAge: 900, 
      },
    },
  },
  
  debug: process.env.NEXT_PUBLIC_ENV === 'development',
};

async function storePendingGoogleUser(email: string, userData: any ) {
  try {
    await connectDB();
    
    const PendingGoogleUser = require('@/models/pendingGoogleUser').default;
    
    await PendingGoogleUser.deleteMany({ email });
    
    await PendingGoogleUser.create({
      email,
      userData,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });
    
    console.log(`Stored pending Google user data for ${email}`);
  } catch (error) {
    console.error('Error storing pending Google user:', error);
  }
}

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };