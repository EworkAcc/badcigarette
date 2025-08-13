import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie } from '@/lib/authUtils.server';
import { MarketingAnalyticsService } from '@/lib/marketingAnalyticsService';

export async function GET(request: NextRequest) {
  try {
    const userData = await getAuthCookie(request);
    if (!userData) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const isGoogleUser = userData.loginType === 'google';
    const analytics = await MarketingAnalyticsService.getUserAnalytics(userData.id, isGoogleUser);
    
    if (!analytics) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const response = {
      userId: userData.id,
      userEmail: userData.email,
      userName: userData.name,
      loginType: userData.loginType,
      analytics: {
        ipVisits: Object.fromEntries(analytics.ipVisits),
        reviewsBySubCigarette: Object.fromEntries(analytics.reviewsBySubCigarette),
        commentsBySubCigarette: Object.fromEntries(analytics.commentsBySubCigarette),
        summary: {
          totalIPs: analytics.ipVisits.size,
          totalIPVisits: Array.from(analytics.ipVisits.values()).reduce((sum, count) => sum + count, 0),
          totalReviews: Array.from(analytics.reviewsBySubCigarette.values()).reduce((sum, count) => sum + count, 0),
          totalComments: Array.from(analytics.commentsBySubCigarette.values()).reduce((sum, count) => sum + count, 0),
          uniqueCigarettesReviewed: analytics.reviewsBySubCigarette.size,
          uniqueCigarettesCommented: analytics.commentsBySubCigarette.size
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error retrieving marketing analytics:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ipAddress } = await request.json();
    
    const userData = await getAuthCookie(request);
    if (!userData) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!ipAddress) {
      return NextResponse.json(
        { message: 'IP address is required' },
        { status: 400 }
      );
    }

    const isGoogleUser = userData.loginType === 'google';
    await MarketingAnalyticsService.updateIpVisit(userData.id, userData.email, ipAddress, isGoogleUser);

    return NextResponse.json({
      message: 'IP visit recorded successfully',
      userId: userData.id,
      ipAddress: ipAddress
    });

  } catch (error) {
    console.error('Error recording IP visit:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}