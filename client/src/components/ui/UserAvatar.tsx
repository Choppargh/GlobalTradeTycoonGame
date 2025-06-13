import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UserAvatarProps {
  onChangeDisplayName: () => void;
}

export function UserAvatar({ onChangeDisplayName }: UserAvatarProps) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
  };

  const handleChangeDisplayName = () => {
    setIsMenuOpen(false);
    onChangeDisplayName();
  };

  const getAvatarContent = () => {
    // Use platform avatar if available
    if (user?.avatar) {
      return (
        <img 
          src={user.avatar} 
          alt="User Avatar" 
          className="w-full h-full object-cover"
        />
      );
    }

    // Fallback to initials
    const initials = user?.displayName 
      ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : user?.username?.slice(0, 2).toUpperCase() || 'U';

    return (
      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-medium">
        {initials}
      </div>
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        {getAvatarContent()}
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-50">
          {/* User Info */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-medium text-gray-900 truncate">
              {user?.displayName || user?.username}
            </p>
            {user?.email && (
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleChangeDisplayName}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              Change Trader Name
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}