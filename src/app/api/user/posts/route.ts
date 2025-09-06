import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';
import { getAuthCookie } from '@/lib/authUtils.server';

export async function GET(request: NextRequest) {
  try {
    const userData = await getAuthCookie(request);
    if (!userData) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const subCigarettesWithUserPosts = await subCigarettes.find({
      'posts.userEmail': userData.email
    }).select('name posts').lean();

    const userPosts = [];
    
    for (const subCigarette of subCigarettesWithUserPosts) {
      const userPostsInThisCigarette = subCigarette.posts.filter(
        (post: any) => post.userEmail === userData.email
      );
      
      for (const post of userPostsInThisCigarette) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentVotes = (post.votes?.noOfUpvotes || 0) + (post.votes?.noOfDownvotes || 0);
        
        const recentComments = post.comments?.filter((comment: any) => 
          new Date(comment.createdAt) > oneWeekAgo
        ).length || 0;
        
        const activityScore = recentVotes + (recentComments * 2); 
        
        userPosts.push({
          id: post.id,
          title: post.title,
          body: post.body,
          rating: post.rating,
          cigaretteName: subCigarette.name,
          cigaretteId: subCigarette.id,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          votes: {
            upvotes: post.votes?.noOfUpvotes || 0,
            downvotes: post.votes?.noOfDownvotes || 0,
            total: (post.votes?.noOfUpvotes || 0) + (post.votes?.noOfDownvotes || 0)
          },
          commentsCount: post.comments?.length || 0,
          recentActivity: {
            recentVotes,
            recentComments,
            activityScore,
            hasRecentActivity: activityScore > 0
          }
        });
      }
    }

    userPosts.sort((a, b) => {
      if (a.recentActivity.activityScore !== b.recentActivity.activityScore) {
        return b.recentActivity.activityScore - a.recentActivity.activityScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const limitedPosts = userPosts.slice(0, 10);

    return NextResponse.json({
      posts: limitedPosts,
      totalPosts: userPosts.length
    });

  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
