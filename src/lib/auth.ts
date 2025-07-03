import { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { User, Account, Profile } from 'next-auth';
import connectDB from './connectDB';
import GoogleUser from '../models/googleUsers';

export const authConfig: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          
          const existingUser = await GoogleUser.findOne({ 
            email: user.email 
          });

          if (!existingUser) {
            await GoogleUser.create({
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image
            });
          } else {
            await GoogleUser.findOneAndUpdate(
              { email: user.email },
              {
                name: user.name,
                image: user.image,
                googleId: account.providerAccountId
              }
            );
          }
          
          return true;
        } catch (error) {
          console.error('Error saving user to database:', error);
          return false;
        }
      }
      return true;
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
                id: dbUser._id.toString()
              }
            };
          }
        } catch (error) {
          console.error('Error fetching user from database:', error);
        }
      }
      return session;
    },
    async jwt({ token, account }) {
      return token;
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, 
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.callback-url' 
        : 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: false, 
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Host-next-auth.csrf-token' 
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, 
      },
    },

    state: {
      name: 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, 
        maxAge: 900, 
      },
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
};