'use client';

import React from 'react';

interface UserAvatarProps {
  src: string;
  alt: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, alt, className = '' }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = '/defaultPFP.png';
      }}
    />
  );
};

export default UserAvatar;