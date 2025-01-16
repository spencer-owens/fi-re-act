import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ScrollArea } from '../components/ui/ScrollArea';

export default function DirectMessage() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Subscribe to conversation data and fetch other user's details
  useEffect(() => {
    if (!user || !conversationId) return;

    const unsubConversation = onSnapshot(
      doc(db, 'conversations', conversationId),
      async (doc) => {
        if (doc.exists()) {
          const conversationData = { id: doc.id, ...doc.data() };
          setConversation(conversationData);

          // Get the other user's ID and fetch their details
          const otherUserId = conversationData.participantIds.find(id => id !== user.uid);
          if (otherUserId) {
            const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
            if (otherUserDoc.exists()) {
              setOtherUser({ id: otherUserDoc.id, ...otherUserDoc.data() });
            }
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching conversation:', error);
        setLoading(false);
      }
    );

    return () => unsubConversation();
  }, [conversationId, user]);

  // Subscribe to messages
  useEffect(() => {
    if (!user || !conversationId) return;

    const messagesQuery = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubMessages = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const newMessages = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .reverse(); // Show oldest messages first
        setMessages(newMessages);
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );

    return () => unsubMessages();
  }, [conversationId, user]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    try {
      const messageData = {
        text: newMessage,
        conversationId,
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      };

      // Add the message
      await addDoc(collection(db, 'messages'), messageData);

      // Update conversation's last message
      await setDoc(doc(db, 'conversations', conversationId), {
        lastMessage: messageData.text,
        lastMessageAt: messageData.createdAt,
        updatedAt: messageData.createdAt
      }, { merge: true });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!conversation || !otherUser) {
    return (
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-400">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Conversation Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className={`
            w-2 h-2 rounded-full
            ${otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'}
          `} />
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {otherUser.displayName || otherUser.email}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {otherUser.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.userId === user.uid ? 'justify-end' : ''
              }`}
            >
              {message.userId !== user.uid && (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  {otherUser.displayName?.[0].toUpperCase() || otherUser.email[0].toUpperCase()}
                </div>
              )}
              <div className={`
                max-w-[70%]
                ${message.userId === user.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}
                rounded-lg px-4 py-2
              `}>
                <p className="break-words">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${otherUser.displayName || otherUser.email}`}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 