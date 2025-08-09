'use client';

import React, { useState, useEffect } from 'react';

interface RateLimitWarningProps {
  type: 'post' | 'comment';
  cigaretteId?: string;
  onStatusChange?: (canAct: boolean) => void;
}

interface RateLimitStatus {
  canPostNow: boolean;
  canCommentNow: boolean;
  nextPostAllowed?: string;
  nextCommentAllowed?: string;
  totalPosts: number;
  totalComments: number;
}

const RateLimitWarning: React.FC<RateLimitWarningProps> = ({ 
  type, 
  cigaretteId, 
  onStatusChange 
}) => {
  const [status, setStatus] = useState<RateLimitStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status) {
      const canAct = type === 'post' ? status.canPostNow : status.canCommentNow;
      onStatusChange?.(canAct);
      
      if (!canAct) {
        interval = setInterval(updateTimeRemaining, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, type, onStatusChange]);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/user/rateLimitStatus');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching rate limit status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeRemaining = () => {
    if (!status) return;

    const nextAllowed = type === 'post' ? status.nextPostAllowed : status.nextCommentAllowed;
    if (!nextAllowed) return;

    const now = new Date().getTime();
    const target = new Date(nextAllowed).getTime();
    const difference = target - now;

    if (difference <= 0) {
      setTimeRemaining('');
      fetchStatus();
      return;
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    } else if (minutes > 0) {
      setTimeRemaining(`${minutes}m ${seconds}s`);
    } else {
      setTimeRemaining(`${seconds}s`);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-700 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
          <span className="text-sm">Checking rate limits...</span>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const canAct = type === 'post' ? status.canPostNow : status.canCommentNow;
  const nextAllowed = type === 'post' ? status.nextPostAllowed : status.nextCommentAllowed;

  if (canAct) {
    return (
      <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 mb-4">
        <div className="text-blue-300 text-sm">
          {type === 'post' ? (
            <div>
              <p className="font-medium mb-1">📝 Review Guidelines:</p>
              <ul className="text-xs space-y-1 text-blue-200">
                <li>• One review per cigarette maximum</li>
                <li>• 48-hour cooldown between reviews</li>
                <li>• You've posted {status.totalPosts} review{status.totalPosts !== 1 ? 's' : ''} total</li>
              </ul>
            </div>
          ) : (
            <div>
              <p className="font-medium mb-1">💬 Comment Guidelines:</p>
              <ul className="text-xs space-y-1 text-blue-200">
                <li>• 7-minute cooldown between comments</li>
                <li>• Only first comment per cigarette affects rating</li>
                <li>• You've posted {status.totalComments} comment{status.totalComments !== 1 ? 's' : ''} total</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <div className="text-red-400 text-xl">⏰</div>
        <div>
          <h3 className="text-red-300 font-medium mb-2">
            {type === 'post' ? 'Review Rate Limit' : 'Comment Rate Limit'}
          </h3>
          <div className="text-red-200 text-sm space-y-1">
            {type === 'post' ? (
              <div>
                <p>You need to wait before posting another review.</p>
                <p className="font-mono text-red-300">Time remaining: {timeRemaining}</p>
                <p className="text-xs text-red-300 mt-2">
                  Rate limits prevent spam and ensure quality discussions.
                </p>
              </div>
            ) : (
              <div>
                <p>Please wait before posting another comment.</p>
                <p className="font-mono text-red-300">Time remaining: {timeRemaining}</p>
                <p className="text-xs text-red-300 mt-2">
                  This brief cooldown helps prevent spam while allowing active discussion.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitWarning;