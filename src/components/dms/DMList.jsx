import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function DMList({ isCollapsed }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    // Query for conversations where user is a participant
    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Get the other user's ID (the one that's not the current user)
        otherUserId: doc.data().participantIds.find(id => id !== user.uid)
      }));
      setConversations(convos);
      setLoading(false);
    });

    return () => unsubscribe();
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
      {conversations.map((conversation) => {
        const isActive = location.pathname === `/dm/${conversation.id}`;

        return (
          <Link
            key={conversation.id}
            to={`/dm/${conversation.id}`}
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
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              {!isCollapsed && (
                <span className="truncate">
                  {conversation.otherUserId}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
} 