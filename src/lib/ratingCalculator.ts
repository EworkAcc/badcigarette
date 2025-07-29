export const calculateOverallRating = (posts: any[]): { rating: number; totalReviews: number } => {
  let totalRating = 0;
  let totalReviews = 0;

  posts.forEach(post => {
    if (post.rating && post.rating > 0) {
      totalRating += post.rating;
      totalReviews += 1;
    }

    if (post.comments && Array.isArray(post.comments)) {
      post.comments.forEach((comment: any) => {
        if (comment.rating && comment.rating > 0) {
          totalRating += comment.rating;
          totalReviews += 1;
        }
      });
    }
  });

  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
  
  return {
    rating: Math.round(averageRating * 10) / 10, 
    totalReviews
  };
};