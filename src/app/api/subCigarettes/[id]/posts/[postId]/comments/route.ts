    import { NextRequest, NextResponse } from 'next/server';
    import connectDB from '@/lib/connectDB';
    import subCigarettes from '@/models/subCigarettes';
    import { getAuthCookie } from '@/lib/authUtils.server';
    import { calculateOverallRating } from '@/lib/ratingCalculator';
    import generateUniqueId from '@/lib/uniqueID';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; postId: string }> }
    ) {
    try {
        const { id: cigaretteId, postId } = await params;

        await connectDB();
        
        const subCigarette = await subCigarettes.findOne({
        id: cigaretteId,
        'posts.id': postId
        });

        if (!subCigarette) {
        return NextResponse.json(
            { message: 'Post not found' },
            { status: 404 }
        );
        }

        const post = subCigarette.posts.find((p: any) => p.id === postId);
        if (!post) {
        return NextResponse.json(
            { message: 'Post not found' },
            { status: 404 }
        );
        }

        return NextResponse.json({
        comments: post.comments || []
        });

    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
        );
    }
    }

    export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; postId: string }> }
    ) {
    try {
        const { id: cigaretteId, postId } = await params;
        const { body, rating, parentId, replyingTo } = await request.json();

        if (!body || body.trim() === '') {
        return NextResponse.json(
            { message: 'Comment body is required' },
            { status: 400 }
        );
        }

        const userData = await getAuthCookie(request);
        if (!userData) {
        return NextResponse.json(
            { message: 'Authentication required' },
            { status: 401 }
        );
        }

        await connectDB();
        
        const subCigarette = await subCigarettes.findOne({
        id: cigaretteId,
        'posts.id': postId
        });

        if (!subCigarette) {
        return NextResponse.json(
            { message: 'Post not found' },
            { status: 404 }
        );
        }

        const postIndex = subCigarette.posts.findIndex((p: any) => p.id === postId);
        if (postIndex === -1) {
        return NextResponse.json(
            { message: 'Post not found' },
            { status: 404 }
        );
        }

        let depth = 0;
        if (parentId) {
        const parentComment = subCigarette.posts[postIndex].comments.find((c: any) => c.id === parentId);
        if (parentComment) {
            depth = Math.min(parentComment.depth + 1, 1); 
        }
        }

        const newComment = {
        id: generateUniqueId(),
        body: body.trim(),
        user: userData.name,
        userEmail: userData.email,
        userImage: userData.image || '/defaultPFP.png',
        postId,
        rating: Math.max(0, Math.min(5, rating || 0)), 
        parentId: parentId || null,
        replyingTo: replyingTo || null,
        depth,
        votes: {
            id: generateUniqueId(),
            noOfUpvotes: 0,
            noOfDownvotes: 0,
            userUp: [],
            userDown: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
        };

        subCigarette.posts[postIndex].comments.push(newComment);
        
        const { rating: newOverallRating, totalReviews } = calculateOverallRating(subCigarette.posts);
        subCigarette.rating = newOverallRating;
        subCigarette.noOfReviews = totalReviews;

        await subCigarette.save();

        return NextResponse.json({
        message: 'Comment created successfully',
        comment: {
            ...newComment,
            createdAt: newComment.createdAt.toISOString(),
            updatedAt: newComment.updatedAt.toISOString()
        },
        updatedRating: subCigarette.rating,
        totalReviews: subCigarette.noOfReviews
        });

    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
        );
    }
}