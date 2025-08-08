import connectDB from '@/lib/connectDB';
import RateLimit from '@/models/rateLimits';
import subCigarettes from '@/models/subCigarettes';

export interface RateLimitResult {
  allowed: boolean;
  remainingTime?: number; 
  message?: string;
  isFirstComment?: boolean; 
}

export class RateLimitService {
  
  static async checkPostLimit(userId: string, userEmail: string, subCigaretteId: string): Promise<RateLimitResult> {
    await connectDB();

    try {
      const existingReview = await RateLimit.findOne({
        userId,
        type: 'post',
        subCigaretteId
      });

      if (existingReview) {
        return {
          allowed: false,
          message: 'You have already reviewed this cigarette. Only one review per user per cigarette is allowed.'
        };
      }

      const cooldownPeriod = 48 * 60 * 60 * 1000; 
      const lastPost = await RateLimit.findOne({
        userId,
        type: 'post'
      }).sort({ lastAction: -1 });

      if (lastPost) {
        const timeSinceLastPost = Date.now() - lastPost.lastAction.getTime();
        if (timeSinceLastPost < cooldownPeriod) {
          const remainingTime = cooldownPeriod - timeSinceLastPost;
          return {
            allowed: false,
            remainingTime,
            message: `Please wait ${Math.ceil(remainingTime / (60 * 60 * 1000))} hours before posting another review.`
          };
        }
      }

      return { allowed: true };

    } catch (error) {
      console.error('Error checking post rate limit:', error);
      return { allowed: true };
    }
  }

  static async recordPost(userId: string, userEmail: string, subCigaretteId: string): Promise<void> {
    await connectDB();

    try {
      await RateLimit.create({
        userId,
        userEmail,
        type: 'post',
        subCigaretteId,
        lastAction: new Date(),
        actionCount: 1
      });
    } catch (error) {
      console.error('Error recording post action:', error);
    }
  }

  static async checkCommentLimit(userId: string, userEmail: string): Promise<RateLimitResult> {
    await connectDB();

    try {
      const cooldownPeriod = 7 * 60 * 1000;
      const lastComment = await RateLimit.findOne({
        userId,
        type: 'comment'
      }).sort({ lastAction: -1 });

      if (lastComment) {
        const timeSinceLastComment = Date.now() - lastComment.lastAction.getTime();
        if (timeSinceLastComment < cooldownPeriod) {
          const remainingTime = cooldownPeriod - timeSinceLastComment;
          return {
            allowed: false,
            remainingTime,
            message: `Please wait ${Math.ceil(remainingTime / (60 * 1000))} minutes before posting another comment.`
          };
        }
      }

      return { allowed: true };

    } catch (error) {
      console.error('Error checking comment rate limit:', error);
      return { allowed: true };
    }
  }

  static async checkFirstComment(userId: string, subCigaretteId: string): Promise<boolean> {
    await connectDB();

    try {
      const userRateLimit = await RateLimit.findOne({
        userId,
        type: 'comment'
      });

      if (!userRateLimit || !userRateLimit.firstCommentCigarettes.includes(subCigaretteId)) {
        return true; 
      }

      return false; 
    } catch (error) {
      console.error('Error checking first comment:', error);
      return true; 
    }
  }

  static async recordComment(userId: string, userEmail: string, subCigaretteId: string, isFirstComment: boolean): Promise<void> {
    await connectDB();

    try {
      const existingRecord = await RateLimit.findOne({
        userId,
        type: 'comment'
      });

      if (existingRecord) {
        existingRecord.lastAction = new Date();
        existingRecord.actionCount += 1;
        
        if (isFirstComment && !existingRecord.firstCommentCigarettes.includes(subCigaretteId)) {
          existingRecord.firstCommentCigarettes.push(subCigaretteId);
        }
        
        await existingRecord.save();
      } else {
        await RateLimit.create({
          userId,
          userEmail,
          type: 'comment',
          lastAction: new Date(),
          actionCount: 1,
          firstCommentCigarettes: isFirstComment ? [subCigaretteId] : []
        });
      }
    } catch (error) {
      console.error('Error recording comment action:', error);
    }
  }

  static async cleanup(): Promise<void> {
    await connectDB();

    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      await RateLimit.deleteMany({
        type: 'comment',
        lastAction: { $lt: thirtyDaysAgo }
      });

      console.log('Rate limit cleanup completed');
    } catch (error) {
      console.error('Error during rate limit cleanup:', error);
    }
  }

  static async getUserStatus(userId: string): Promise<{
    lastPostTime?: Date;
    nextPostAllowed?: Date;
    lastCommentTime?: Date;
    nextCommentAllowed?: Date;
    totalPosts: number;
    totalComments: number;
  }> {
    await connectDB();

    try {
      const lastPost = await RateLimit.findOne({ userId, type: 'post' }).sort({ lastAction: -1 });
      const lastComment = await RateLimit.findOne({ userId, type: 'comment' }).sort({ lastAction: -1 });
      const totalPosts = await RateLimit.countDocuments({ userId, type: 'post' });
      const commentRecord = await RateLimit.findOne({ userId, type: 'comment' });

      const result: any = {
        totalPosts,
        totalComments: commentRecord?.actionCount || 0
      };

      if (lastPost) {
        result.lastPostTime = lastPost.lastAction;
        result.nextPostAllowed = new Date(lastPost.lastAction.getTime() + 48 * 60 * 60 * 1000);
      }

      if (lastComment) {
        result.lastCommentTime = lastComment.lastAction;
        result.nextCommentAllowed = new Date(lastComment.lastAction.getTime() + 7 * 60 * 1000);
      }

      return result;
    } catch (error) {
      console.error('Error getting user status:', error);
      return { totalPosts: 0, totalComments: 0 };
    }
  }
}