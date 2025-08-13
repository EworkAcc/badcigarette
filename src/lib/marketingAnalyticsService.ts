import { GoogleUser } from '@/models/googleUsers';
import User from '@/models/User';
import connectDB from './connectDB';
import { NextRequest } from 'next/server';

export class MarketingAnalyticsService {
  static getIpAddress(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
      return realIp.trim();
    }

    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    if (cfConnectingIp) {
      return cfConnectingIp.trim();
    }

    if ((request as any).ip) {
      return (request as any).ip;
    }

    return '127.0.0.1'; 
  }

  static async updateIpVisit(userId: string, userEmail: string, ipAddress: string, isGoogleUser: boolean = false): Promise<void> {
    try {
      await connectDB();

      const Model = isGoogleUser ? GoogleUser : User;
      const userQuery = isGoogleUser ? { googleId: userId } : { _id: userId };

      const user = await Model.findOne(userQuery);
      if (!user) {
        console.warn(`User not found for IP visit update: ${userId}`);
        return;
      }

      const currentIpVisits = user.ipVisits || new Map();
      const currentCount = currentIpVisits.get(ipAddress) || 0;

      await Model.updateOne(userQuery, {
        $set: {
          [`ipVisits.${ipAddress}`]: currentCount + 1
        }
      });

      console.log(`Updated IP visit count for ${userEmail} from ${ipAddress}: ${currentCount + 1}`);
    } catch (error) {
      console.error('Error updating IP visit:', error);
    }
  }

  static async updateReviewCount(userId: string, userEmail: string, subCigaretteId: string, isGoogleUser: boolean = false): Promise<void> {
    try {
      await connectDB();

      const Model = isGoogleUser ? GoogleUser : User;
      const userQuery = isGoogleUser ? { googleId: userId } : { _id: userId };

      const user = await Model.findOne(userQuery);
      if (!user) {
        console.warn(`User not found for review count update: ${userId}`);
        return;
      }

      const currentReviews = user.reviewsBySubCigarette || new Map();
      const currentCount = currentReviews.get(subCigaretteId) || 0;

      await Model.updateOne(userQuery, {
        $set: {
          [`reviewsBySubCigarette.${subCigaretteId}`]: currentCount + 1
        }
      });

      console.log(`Updated review count for ${userEmail} on ${subCigaretteId}: ${currentCount + 1}`);
    } catch (error) {
      console.error('Error updating review count:', error);
    }
  }

  static async updateCommentCount(userId: string, userEmail: string, subCigaretteId: string, isGoogleUser: boolean = false): Promise<void> {
    try {
      await connectDB();

      const Model = isGoogleUser ? GoogleUser : User;
      const userQuery = isGoogleUser ? { googleId: userId } : { _id: userId };

      const user = await Model.findOne(userQuery);
      if (!user) {
        console.warn(`User not found for comment count update: ${userId}`);
        return;
      }

      const currentComments = user.commentsBySubCigarette || new Map();
      const currentCount = currentComments.get(subCigaretteId) || 0;

      await Model.updateOne(userQuery, {
        $set: {
          [`commentsBySubCigarette.${subCigaretteId}`]: currentCount + 1
        }
      });

      console.log(`Updated comment count for ${userEmail} on ${subCigaretteId}: ${currentCount + 1}`);
    } catch (error) {
      console.error('Error updating comment count:', error);
    }
  }

  static async getUserAnalytics(
    userId: string,
    isGoogleUser: boolean = false
  ): Promise<{
    ipVisits: Map<string, number>;
    reviewsBySubCigarette: Map<string, number>;
    commentsBySubCigarette: Map<string, number>;
  } | null> {
    try {
      await connectDB();

      const Model = isGoogleUser ? GoogleUser : User;
      const userQuery = isGoogleUser ? { googleId: userId } : { _id: userId };

      const user = await Model.findOne(userQuery).select('ipVisits reviewsBySubCigarette commentsBySubCigarette');
      if (!user) {
        return null;
      }

      return {
        ipVisits: user.ipVisits || new Map(),
        reviewsBySubCigarette: user.reviewsBySubCigarette || new Map(),
        commentsBySubCigarette: user.commentsBySubCigarette || new Map()
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  }
}
