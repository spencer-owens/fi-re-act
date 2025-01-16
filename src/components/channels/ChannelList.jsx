import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function ChannelList({ isCollapsed }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    // Query for public channels and private channels where user is a member
    const publicChannelsQuery = query(
      collection(db, 'channels'),
      where('type', '==', 'public'),
      orderBy('name')
    );

    const privateChannelsQuery = query(
      collection(db, 'channels'),
      where('type', '==', 'private'),
      where('members', 'array-contains', user.uid),
      orderBy('name')
    );

    // Subscribe to both queries
    const unsubPublic = onSnapshot(publicChannelsQuery, (publicSnapshot) => {
      const publicChannels = publicSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Update channels, preserving private channels
      setChannels(prev => {
        const privateChannels = prev.filter(channel => channel.type === 'private');
        return [...publicChannels, ...privateChannels].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
      });
      setLoading(false);
    });

    const unsubPrivate = onSnapshot(privateChannelsQuery, (privateSnapshot) => {
      const privateChannels = privateSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Update channels, preserving public channels
      setChannels(prev => {
        const publicChannels = prev.filter(channel => channel.type === 'public');
        return [...publicChannels, ...privateChannels].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
      });
    });

    return () => {
      unsubPublic();
      unsubPrivate();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="px-2">
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {channels.map((channel) => {
        const isActive = location.pathname === `/channel/${channel.id}`;

        return (
          <Link
            key={channel.id}
            to={`/channel/${channel.id}`}
            className={`
              flex items-center justify-between
              px-2 py-1.5 rounded
              ${isActive 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-gray-400">#</span>
              {!isCollapsed && (
                <span className="truncate">
                  {channel.name}
                  {channel.type === 'private' && ' (private)'}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
} 