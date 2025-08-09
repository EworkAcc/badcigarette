import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie } from '@/lib/authUtils.server';
import { RateLimitService } from '@/lib/rateLimitService';

export async function GET(request: NextRequest) {
  try {
    const userData = await getAuthCookie(request);
    if (!userData) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const status = await RateLimitService.getUserStatus(userData.id);

    const now = new Date();
    const canPostNow = !status.nextPostAllowed || now >= status.nextPostAllowed;
    const canCommentNow = !status.nextCommentAllowed || now >= status.nextCommentAllowed;

    return NextResponse.json({
      canPostNow,
      canCommentNow,
      ...status,
      lastPostTime: status.lastPostTime?.toISOString(),
      nextPostAllowed: status.nextPostAllowed?.toISOString(),
      lastCommentTime: status.lastCommentTime?.toISOString(),
      nextCommentAllowed: status.nextCommentAllowed?.toISOString(),
    });

  } catch (error) {
    console.error('Error fetching rate limit status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}