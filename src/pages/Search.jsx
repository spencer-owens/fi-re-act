import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Command } from '../components/ui/Command';
import { ScrollArea } from '../components/ui/ScrollArea';

export default function Search() {
  const [searchResults, setSearchResults] = useState({ messages: [], channels: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setSearchResults({ messages: [], channels: [] });
      return;
    }

    setLoading(true);

    try {
      // Search messages
      const messageQuery = query(
        collection(db, 'messages'),
        where('text', '>=', value),
        where('text', '<=', value + '\uf8ff'),
        orderBy('text'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      // Search channels
      const channelQuery = query(
        collection(db, 'channels'),
        where('name', '>=', value),
        where('name', '<=', value + '\uf8ff'),
        orderBy('name'),
        limit(5)
      );

      const [messageSnapshot, channelSnapshot] = await Promise.all([
        getDocs(messageQuery),
        getDocs(channelQuery)
      ]);

      const messages = messageSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const channels = channelSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setSearchResults({ messages, channels });
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Search
      </h1>

      <Command className="rounded-lg border shadow-md">
        <Command.Input
          placeholder="Search messages and channels..."
          onValueChange={handleSearch}
        />
        <Command.List>
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {searchResults.channels.length > 0 && (
                  <Command.Group heading="Channels">
                    {searchResults.channels.map((channel) => (
                      <Command.Item
                        key={channel.id}
                        onSelect={() => navigate(`/channel/${channel.id}`)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">#</span>
                          <span>{channel.name}</span>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {searchResults.messages.length > 0 && (
                  <Command.Group heading="Messages">
                    {searchResults.messages.map((message) => (
                      <Command.Item
                        key={message.id}
                        onSelect={() => 
                          navigate(
                            message.channelId 
                              ? `/channel/${message.channelId}` 
                              : `/dm/${message.conversationId}`
                          )
                        }
                      >
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {message.userName}
                          </p>
                          <p className="truncate">{message.text}</p>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {searchResults.channels.length === 0 && searchResults.messages.length === 0 && (
                  <Command.Empty>No results found.</Command.Empty>
                )}
              </>
            )}
          </ScrollArea>
        </Command.List>
      </Command>
    </div>
  );
} 