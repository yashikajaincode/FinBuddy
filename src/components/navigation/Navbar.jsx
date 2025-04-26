import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [profileMenu, setProfileMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-semibold">FinBuddy</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative"
            onClick={() => setProfileMenu(!profileMenu)}
          >
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              U
            </div>
            {profileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;