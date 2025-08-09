interface Post {
  rating: number;
  comments?: Comment[];
}

interface Comment {
  rating: number;
  user: string;
  userEmail: string;
  subCigaretteId?: string;
}

export function calculateOverallRating(posts: Post[]): { rating: number; totalReviews: number } {
  let totalRating = 0;
  let reviewCount = 0;

  const userLastCommentRating = new Map<string, number>();

  posts.forEach(post => {
    if (post.rating > 0) {
      totalRating += post.rating;
      reviewCount++;
    }

    if (post.comments) {
      post.comments.forEach(comment => {
        if (comment.rating > 0) {
          const userKey = comment.userEmail || comment.user;
          
          userLastCommentRating.set(userKey, comment.rating);
        }
      });
    }
  });

  userLastCommentRating.forEach(rating => {
    totalRating += rating;
    reviewCount++;
  });

  const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
  
  return {
    rating: Math.round(averageRating * 10) / 10, 
    totalReviews: reviewCount
  };
}

export function shouldCommentAffectRating(
  existingComments: Comment[], 
  userEmail: string, 
  userName: string
): boolean {
  return true;
}