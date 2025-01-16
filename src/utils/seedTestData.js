import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Test users data
const testUsers = [
  {
    id: 'user1',
    email: 'alice@test.com',
    displayName: 'Alice Cooper',
    photoURL: null,
    isOnline: true,
    createdAt: serverTimestamp()
  },
  {
    id: 'user2',
    email: 'bob@test.com',
    displayName: 'Bob Wilson',
    photoURL: null,
    isOnline: false,
    createdAt: serverTimestamp()
  },
  {
    id: 'user3',
    email: 'carol@test.com',
    displayName: 'Carol Martinez',
    photoURL: null,
    isOnline: true,
    createdAt: serverTimestamp()
  }
];

// Test channels data
const testChannels = [
  {
    id: 'channel1',
    name: 'general',
    description: 'General discussion channel',
    type: 'public',
    createdBy: 'user1',
    createdAt: serverTimestamp(),
    members: ['user1', 'user2', 'user3']
  },
  {
    id: 'channel2',
    name: 'random',
    description: 'Random conversations and fun stuff',
    type: 'public',
    createdBy: 'user2',
    createdAt: serverTimestamp(),
    members: ['user1', 'user2']
  },
  {
    id: 'channel3',
    name: 'private-team',
    description: 'Private team discussions',
    type: 'private',
    createdBy: 'user1',
    createdAt: serverTimestamp(),
    members: ['user1', 'user3']
  }
];

// Test conversations (DMs) data
const testConversations = [
  {
    id: 'conv1',
    participantIds: ['user1', 'user2'],
    createdAt: serverTimestamp(),
    lastMessage: 'Hey Bob, how are you?',
    lastMessageAt: serverTimestamp()
  },
  {
    id: 'conv2',
    participantIds: ['user1', 'user3'],
    createdAt: serverTimestamp(),
    lastMessage: 'Carol, can you help me with something?',
    lastMessageAt: serverTimestamp()
  }
];

// Sample messages for both channels and DMs
const testMessages = [
  // Channel messages
  {
    text: 'Welcome everyone to the general channel!',
    channelId: 'channel1',
    userId: 'user1',
    userName: 'Alice Cooper',
    createdAt: serverTimestamp()
  },
  {
    text: 'Thanks Alice! Excited to be here.',
    channelId: 'channel1',
    userId: 'user2',
    userName: 'Bob Wilson',
    createdAt: serverTimestamp()
  },
  {
    text: 'This is our private team channel.',
    channelId: 'channel3',
    userId: 'user1',
    userName: 'Alice Cooper',
    createdAt: serverTimestamp()
  },
  // DM messages
  {
    text: 'Hey Bob, how are you?',
    conversationId: 'conv1',
    userId: 'user1',
    userName: 'Alice Cooper',
    createdAt: serverTimestamp()
  },
  {
    text: "I'm good Alice, thanks for asking!",
    conversationId: 'conv1',
    userId: 'user2',
    userName: 'Bob Wilson',
    createdAt: serverTimestamp()
  },
  {
    text: 'Carol, can you help me with something?',
    conversationId: 'conv2',
    userId: 'user1',
    userName: 'Alice Cooper',
    createdAt: serverTimestamp()
  }
];

// Function to seed the test data
export async function seedTestData(db) {
  try {
    // Add users
    for (const user of testUsers) {
      const { id, ...userData } = user;
      await setDoc(doc(db, 'users', id), userData);
    }

    // Add channels
    for (const channel of testChannels) {
      const { id, ...channelData } = channel;
      await setDoc(doc(db, 'channels', id), channelData);
    }

    // Add conversations
    for (const conversation of testConversations) {
      const { id, ...conversationData } = conversation;
      await setDoc(doc(db, 'conversations', id), conversationData);
    }

    // Add messages
    for (const message of testMessages) {
      await addDoc(collection(db, 'messages'), message);
    }

    console.log('Test data seeded successfully!');
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
} 