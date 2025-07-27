'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getAuthCookie, getUserImage, getUserDisplayName, UserData, setAuthCookie } from '../lib/authUtils.client';
import ReviewPopup from './ReviewPopUp';

interface ClientSideWrapperProps {
  cigaretteId: string;
}

const ClientSideWrapper: React.FC<ClientSideWrapperProps> = ({ cigaretteId }) => {
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAuth = async () => {
      if (session?.user) {
        const cookieUser = getAuthCookie();
        
        if (cookieUser && cookieUser.loginType === 'google') {
          setUserData(cookieUser);
          setIsLoading(false);
          return;
        }

        if (!cookieUser) {
          try {
            const response = await fetch('/api/auth/googleCookie', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUserData(data.user);
              setIsLoading(false);
              return;
            } else {
              const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
              console.error('Failed to set Google cookie:', response.status, errorData);
              
              console.log('Falling back to session data');
            }
          } catch (error) {
            console.error('Error setting Google cookie:', error);
            console.log('Falling back to session data');
          }
        }

        const googleUserData: UserData = {
          id: (session.user as any).id || 'google-user',
          name: session.user.name || 'Google User',
          email: session.user.email || '',
          image: session.user.image || undefined,
          loginType: 'google'
        };
        
        setUserData(googleUserData);
        setIsLoading(false);
        return;
      }
      
      const cookieUser = getAuthCookie();
      if (cookieUser) {
        setUserData(cookieUser);
      }
      
      if (status !== 'loading') {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [session, status]);

  const handleAddReviewClick = () => {
    if (isLoading) {
      return;
    }
    
    if (!userData) {
      alert('Please log in to submit a review');
      return;
    }
    
    setShowReviewPopup(true);
  };

  const handleReviewSubmit = async (rating: number, reviewText: string, title: string) => {
    if (!userData) {
      alert('Please log in to submit a review');
      return;
    }

    if (!title.trim()) {
      alert('Please provide a title for your review');
      return;
    }

    setIsSubmitting(true);

    try {
      if (userData.loginType === 'google') {
        const cookieUser = getAuthCookie();
        if (!cookieUser) {
          try {
            const response = await fetch('/api/auth/googleCookie', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
              console.error('Failed to authenticate before review:', response.status, errorData);

              console.log('Attempting to manually set auth cookie');
              setAuthCookie(userData);
              
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          } catch (error) {
            console.error('Error setting Google cookie before validation:', error);
            
            console.log('Attempting to manually set auth cookie as fallback');
            setAuthCookie(userData);
            
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }

      const validateResponse = await fetch('/api/auth/validateUser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (validateResponse.status === 404) {
        alert('User does not exist. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      if (validateResponse.status === 401) {
        alert('Authentication required. Please refresh the page and try again.');
        setIsSubmitting(false);
        return;
      }

      if (!validateResponse.ok) {
        const errorText = await validateResponse.text();
        console.error('Validation error:', validateResponse.status, errorText);
        alert('User validation failed due to server error. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const validationData = await validateResponse.json();
      if (!validationData.valid) {
        alert('User validation failed. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const reviewResponse = await fetch('/api/addReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subCigaretteId: cigaretteId,
          rating,
          reviewText,
          title,
          user: userData.name,
          userEmail: userData.email,
          userImage: getUserImage(userData)
        })
      });

      if (reviewResponse.ok) {
        setShowReviewPopup(false);
        alert('Review submitted successfully!');
        router.refresh();
      } else {
        const errorData = await reviewResponse.json();
        alert(errorData.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareCigarette = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this cigarette review',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-red-400">Actions</h3>
        <div className="space-y-3">
          <button 
            onClick={handleAddReviewClick}
            disabled={isLoading || isSubmitting}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              isLoading || isSubmitting
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : userData
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              'Loading...'
            ) : isSubmitting ? (
              'Submitting...'
            ) : userData ? (
              'Add Review'
            ) : (
              'Login to Review'
            )}
          </button>
          
          <button 
            onClick={handleShareCigarette}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Share Cigarette
          </button>
        </div>

        {userData && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <img 
                src={getUserImage(userData)} 
                alt={getUserDisplayName(userData)} 
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/defaultPFP.png';
                }}
              />
              <div>
                <p className="text-sm text-white font-medium">
                  {getUserDisplayName(userData)}
                </p>
                <p className="text-xs text-gray-400">
                  {userData.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showReviewPopup && userData && (
        <ReviewPopup
          onClose={() => setShowReviewPopup(false)}
          onSubmit={handleReviewSubmit}
          user={userData}
        />
      )}
    </>
  );
};

export default ClientSideWrapper;