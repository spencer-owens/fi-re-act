import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useAuth } from '../../contexts/AuthContext';
import ChannelList from '../channels/ChannelList';
import DMList from '../dms/DMList';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`
          relative flex flex-col
          border-r border-gray-200 dark:border-gray-800
          bg-gray-100 dark:bg-gray-800
          transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-16'}
        `}
      >
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-16 z-10
            w-6 h-6
            bg-gray-200 dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            rounded-full
            flex items-center justify-center
            text-gray-500 dark:text-gray-400
            hover:bg-gray-300 dark:hover:bg-gray-600
            transition-colors"
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="p-4">
            <button
              className={`
                w-full px-3 py-2
                bg-white dark:bg-gray-700
                border border-gray-300 dark:border-gray-600
                rounded-md
                text-left text-gray-500 dark:text-gray-400
                hover:bg-gray-50 dark:hover:bg-gray-600
                transition-colors
              `}
            >
              {sidebarOpen ? 'Search...' : '🔍'}
            </button>
          </div>

          {/* Channels */}
          <div className="mb-4">
            <div className="px-4 mb-2">
              <h2 className={`
                font-semibold 
                text-gray-900 dark:text-white
                ${!sidebarOpen && 'text-center'}
              `}>
                {sidebarOpen ? 'Channels' : '#'}
              </h2>
            </div>
            <ChannelList isCollapsed={!sidebarOpen} />
          </div>

          {/* Direct Messages */}
          <div className="mb-4">
            <div className="px-4 mb-2">
              <h2 className={`
                font-semibold 
                text-gray-900 dark:text-white
                ${!sidebarOpen && 'text-center'}
              `}>
                {sidebarOpen ? 'Direct Messages' : '@'}
              </h2>
            </div>
            <DMList isCollapsed={!sidebarOpen} />
          </div>

          {/* AI Chat */}
          <div className="p-4">
            <button
              className={`
                w-full px-3 py-2
                bg-blue-500 hover:bg-blue-600
                text-white
                rounded-md
                transition-colors
                flex items-center justify-center
              `}
            >
              {sidebarOpen ? 'Chat with Jonathan AI' : '🤖'}
            </button>
          </div>
        </div>

        {/* User profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`
            flex items-center
            ${!sidebarOpen && 'justify-center'}
          `}>
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
            {sidebarOpen && (
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
} 