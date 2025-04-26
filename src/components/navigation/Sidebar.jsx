import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/budget', label: 'Budget', icon: '💰' },
    { path: '/goals', label: 'Goals', icon: '🎯' },
    { path: '/investments', label: 'Investments', icon: '📈' },
    { path: '/reports', label: 'Reports', icon: '📑' },
    { path: '/assistant', label: 'Assistant', icon: '🤖' }
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="mt-5">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;