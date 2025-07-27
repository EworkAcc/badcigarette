"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { getAuthCookie, getUserImage, getUserDisplayName, removeAuthCookie, UserData } from '../lib/authUtils.client';
import { useRouter } from 'next/navigation';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { data: session, status } = useSession();

  const handleRandomCigarette = async () => {
    if (isLoadingRandom) return;
    
    setIsLoadingRandom(true);
    
    try {
      const response = await fetch('/api/randomCigarette');
      
      if (response.ok) {
        const data = await response.json();
        if (data.cigarette && data.cigarette.id) {
          router.push(`/subCigarettes/${data.cigarette.id}`);
        } else {
          alert('No cigarettes available');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to find random cigarette');
      }
    } catch (error) {
      console.error('Error getting random cigarette:', error);
      alert('Failed to get random cigarette. Please try again.');
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const validateUser = async (user: UserData) => {
    if (isValidating) return true;
    
    if (process.env.NEXT_PUBLIC_ENV === 'development') {
      console.log('Skipping user validation in development mode');
      return true;
    }
  
    try {
      setIsValidating(true);
      const response = await fetch('/api/auth/validateUser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (response.status === 404) {
        console.log('User no longer exists in database, logging out');
        await handleLogout();
        return false;
      }
      
      if (response.status === 401) {
        console.log('No auth cookie found, logging out');
        await handleLogout();
        return false;
      }
      
      if (response.status === 400) {
        console.log('Invalid cookie format, logging out');
        await handleLogout();
        return false;
      }
      
      if (!response.ok) {
        console.log('User validation failed due to server error, but not logging out');
        return false;
      }
    
      const data = await response.json();
      
      if (!data.valid) {
        console.log('User validation returned invalid, logging out');
        await handleLogout();
        return false;
      }
      
      return data.valid;
    } catch (error) {
      console.error('Error validating user:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (session?.user) {
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

    const handleStorageChange = () => {
      if (!session) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [session, status]);

  useEffect(() => {
    if (!userData || isLoading) return;

    const initialValidation = async () => {
      const isValid = await validateUser(userData);
      if (!isValid && !getAuthCookie()) {
        setUserData(null);
      }
    };
    
    const initialTimeout = setTimeout(initialValidation, 1000);

    const validateInterval = setInterval(async () => {
      if (userData && !isValidating) {
        const isValid = await validateUser(userData);
        if (!isValid && !getAuthCookie()) {
          setUserData(null);
        }
      }
    }, 5 * 60 * 1000); 

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(validateInterval);
    };
  }, [userData, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (isValidating) return; 
    
    try {
      if (userData?.loginType === 'google') {
        await signOut({ redirect: false });
      } else {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      removeAuthCookie();
      setUserData(null);
      setIsProfileMenuOpen(false);
      
      window.dispatchEvent(new Event('storage'));
      
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      removeAuthCookie();
      setUserData(null);
      setIsProfileMenuOpen(false);
      window.dispatchEvent(new Event('storage'));
      window.location.href = '/';
    }
  };

  const ProfileMenu = () => (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center space-x-2 text-gray-300 hover:text-white p-2 rounded-md"
      >
        <img
          src={getUserImage(userData)}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/defaultPFP.png';
          }}
        />
        <span className="hidden sm:block text-sm">{getUserDisplayName(userData)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
          <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
            <div className="font-medium text-white">{getUserDisplayName(userData)}</div>
            <div className="text-xs">{userData?.email}</div>
            <div className="text-xs mt-1">
              {userData?.loginType === 'google' ? 'Google Account' : 'Standard Account'}
            </div>
          </div>
          <button
            onClick={() => {
              setIsProfileMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Log out</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="bg-gray-800 text-center py-2 text-sm text-gray-300">
        <span className="font-semibold">10% of profits donated to <span className="text-blue-300 underline hover:text-blue-400"><Link href="https://truthinitiative.org/">Truth Initiative</Link></span></span> | Fighting tobacco addiction through awareness
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="text-white">
                <h1 className="text-2xl font-bold text-red-500">Bad Cigarettes</h1>
                <p className="text-xs text-gray-400 mt-1">CIGARETTES ARE BAD</p>
              </div>
            </div>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <button 
                onClick={handleRandomCigarette}
                disabled={isLoadingRandom}
                className={`text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isLoadingRandom ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoadingRandom ? 'Loading...' : 'Random Cigarette'}
              </button>
              <Link href="/subCigarettes" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Forums
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Stores
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Events
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Magazine
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            ) : userData ? (
              <ProfileMenu />
            ) : (
              <Link href="/signon" className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-md text-sm font-medium">
                Sign On
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  className="transition-all duration-300 ease-in-out"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
              <Link href="./" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Home
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleRandomCigarette();
                }}
                disabled={isLoadingRandom}
                className={`w-full text-left text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium ${
                  isLoadingRandom ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoadingRandom ? 'Loading...' : 'Random Cigarette'}
              </button>
              <Link href="/subCigarettes" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Cigarettes
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Reviews
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Forums
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Stores
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Events
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Magazine
              </Link>
              
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="space-y-1">
                  {isLoading ? (
                    <div className="w-full h-10 bg-gray-700 rounded-md animate-pulse"></div>
                  ) : userData ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 px-3 py-2">
                        <img
                          src={getUserImage(userData)}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/defaultPFP.png';
                          }}
                        />
                        <div>
                          <div className="text-white text-sm font-medium">{getUserDisplayName(userData)}</div>
                          <div className="text-gray-400 text-xs">{userData.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md text-sm font-medium"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md text-sm font-medium"
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <Link href="/signon" className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-md text-sm font-medium block text-center">
                      Sign On
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;