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

      {/* Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            {/* User Info Header */}
            <div className="p-6 text-center border-b border-gray-200">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-200">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="User Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-2xl font-medium">
                    {user?.displayName 
                      ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : user?.username?.slice(0, 2).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                {user?.displayName || user?.username}
              </h3>
              {user?.email && (
                <p className="text-sm text-gray-500">{user.email}</p>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              <button
                onClick={handleChangeDisplayName}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium transition-colors duration-150"
              >
                Change Trader Name
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-lg font-medium transition-colors duration-150"
              >
                Logout
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}