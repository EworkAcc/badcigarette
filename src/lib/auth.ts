import { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { User, Account, Profile } from 'next-auth';
import connectDB from './connectDB';
import GoogleUser from '../models/googleUsers';

export const authConfig: NextAuthConfig = {
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
  pages: {
    signIn: '/auth/signin',
  }
};  