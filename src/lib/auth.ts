import { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import connectDB from './connectDB';
import { GoogleUser } from '../models/googleUsers';

export const authConfig: NextAuthOptions = {
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
          await connectDB();
          
          const existingUser = await GoogleUser.findOne({ 
            email: user.email 
          });

          let dbUser;
          if (!existingUser) {
            dbUser = await GoogleUser.create({
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image
            });
          } else {
            dbUser = await GoogleUser.findOneAndUpdate(
              { email: user.email },
              {
                name: user.name,
                image: user.image,
                googleId: account.providerAccountId
              },
              { new: true }
            );
          }

          user.id = dbUser._id.toString();
          
          return true;
        } catch (error) {
          console.error('Error saving user to database:', error);
          return false;
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
          console.error('Error fetching user from database:', error);
        }
      }
      return session;
    }
  },

  pages: {
    signIn: '/signon', 
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