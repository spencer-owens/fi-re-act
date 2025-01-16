import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, where, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ScrollArea } from '../components/ui/ScrollArea';

export default function JonathanAI() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [thinking, setThinking] = useState(false);
  const { user } = useAuth();
  const scrollRef = useRef(null);

  // Subscribe to AI chat messages
  useEffect(() => {
    const q = query(
      collection(db, 'ai_messages'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubMessages = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .reverse(); // Reverse to show oldest first
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubMessages();
  }, [user.uid]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || thinking) return;

    try {
      setThinking(true);

      // Add user message
      await addDoc(collection(db, 'ai_messages'), {
        text: newMessage,
        userId: user.uid,
        role: 'user',
        createdAt: serverTimestamp(),
      });

      // Simulate AI response (replace with actual AI integration)
      setTimeout(async () => {
        await addDoc(collection(db, 'ai_messages'), {
          text: "I'm Jonathan, your AI assistant. I'm here to help you with financial planning, investment strategies, and achieving your FIRE goals. How can I assist you today?",
          userId: user.uid,
          role: 'assistant',
          createdAt: serverTimestamp(),
        });
        setThinking(false);
      }, 1000);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setThinking(false);
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

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            🤖
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Jonathan AI
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your personal FIRE assistant
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
                message.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  🤖
                </div>
              )}
              <div className={`
                max-w-[70%]
                ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}
                rounded-lg px-4 py-2
              `}>
                <p className="break-words whitespace-pre-wrap">{message.text}</p>
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
            placeholder="Ask Jonathan anything about FIRE..."
            disabled={thinking}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || thinking}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {thinking ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
} 