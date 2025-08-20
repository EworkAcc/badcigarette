import { GoogleUser } from '@/models/googleUsers';
import User from '@/models/User';
import connectDB from './connectDB';
import { NextRequest } from 'next/server';

export class MarketingAnalyticsService {
  static getIpAddress(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      const firstIp = forwarded.split(',')[0].trim();
      if (firstIp && firstIp !== 'unknown') {
        return firstIp;
      }
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp && realIp !== 'unknown') {
      return realIp.trim();
    }

    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    if (cfConnectingIp && cfConnectingIp !== 'unknown') {
      return cfConnectingIp.trim();
    }

    const xClientIp = request.headers.get('x-client-ip');
    if (xClientIp && xClientIp !== 'unknown') {
      return xClientIp.trim();
    }

    const xClusterClientIp = request.headers.get('x-cluster-client-ip');
    if (xClusterClientIp && xClusterClientIp !== 'unknown') {
      return xClusterClientIp.trim();
    }

    if ('ip' in request && typeof request.ip === 'string') {
      const ip = request.ip.trim();
      if (ip === '::1') {
        return '127.0.0.1';
      }
      if (ip !== '::ffff:127.0.0.1' && ip !== '127.0.0.1') {
        return ip;
      }
    }

    const nextRequest = request as any;
    if (nextRequest.connection?.remoteAddress) {
      const remoteAddr = nextRequest.connection.remoteAddress;
      if (remoteAddr === '::1' || remoteAddr === '::ffff:127.0.0.1') {
        return '127.0.0.1';
      }
      return remoteAddr;
    }

    if (nextRequest.socket?.remoteAddress) {
      const socketAddr = nextRequest.socket.remoteAddress;
      if (socketAddr === '::1' || socketAddr === '::ffff:127.0.0.1') {
        return '127.0.0.1';
      }
      return socketAddr;
    }

    return '127.0.0.1';
  }

  static async updateIpVisit(userId: string, userEmail: string, ipAddress: string, isGoogleUser: boolean = false): Promise<void> {
    try {
      await connectDB();

      const Model = isGoogleUser ? GoogleUser : User;
      const userQuery = isGoogleUser ? { _id: userId } : { _id: userId };

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
      const userQuery = isGoogleUser ? { _id: userId } : { _id: userId };

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
