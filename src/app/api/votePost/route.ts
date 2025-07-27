import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';
import generateUniqueId from '@/lib/uniqueID';

export async function POST(request: NextRequest) {
  try {
    const { postId, voteType, userId } = await request.json();

    if (!postId || !voteType || !userId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const subCigarette = await subCigarettes.findOne({
      'posts.id': postId
    });

    if (!subCigarette) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    const postIndex = subCigarette.posts.findIndex((post: any) => post.id === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    const post = subCigarette.posts[postIndex];
    
    if (!post.votes || !Array.isArray(post.votes.userUp) || !Array.isArray(post.votes.userDown)) {
      post.votes = {
        id: generateUniqueId(),
        noOfUpvotes: 0,
        noOfDownvotes: 0,
        userUp: [],
        userDown: []
      };
    }

    const userUpIndex = post.votes.userUp.indexOf(userId);
    const userDownIndex = post.votes.userDown.indexOf(userId);

    if (voteType === 'upvote') {
      if (userUpIndex > -1) {
        post.votes.userUp.splice(userUpIndex, 1);
        post.votes.noOfUpvotes = Math.max(0, post.votes.noOfUpvotes - 1);
      } else {
        post.votes.userUp.push(userId);
        post.votes.noOfUpvotes += 1;
        
        if (userDownIndex > -1) {
          post.votes.userDown.splice(userDownIndex, 1);
          post.votes.noOfDownvotes = Math.max(0, post.votes.noOfDownvotes - 1);
        }
      }
    } else if (voteType === 'downvote') {
      if (userDownIndex > -1) {
        post.votes.userDown.splice(userDownIndex, 1);
        post.votes.noOfDownvotes = Math.max(0, post.votes.noOfDownvotes - 1);
      } else {
        post.votes.userDown.push(userId);
        post.votes.noOfDownvotes += 1;
        
        if (userUpIndex > -1) {
          post.votes.userUp.splice(userUpIndex, 1);
          post.votes.noOfUpvotes = Math.max(0, post.votes.noOfUpvotes - 1);
        }
      }
    }

    subCigarette.posts[postIndex] = post;

    await subCigarette.save();

    return NextResponse.json({
      message: 'Vote updated successfully',
      votes: post.votes
    });

  } catch (error) {
    console.error('Error updating vote:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}