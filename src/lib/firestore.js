import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Initialize user document
export async function initializeUser(user) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName || user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      isOnline: true
    });
  } else {
    // Update online status and last seen
    await setDoc(userRef, {
      isOnline: true,
      updatedAt: new Date()
    }, { merge: true });
  }
}

// Initialize general channel
export async function initializeGeneralChannel() {
  const generalRef = doc(db, 'channels', 'general');
  const generalSnap = await getDoc(generalRef);

  if (!generalSnap.exists()) {
    await setDoc(generalRef, {
      name: 'general',
      description: 'Welcome to the general channel!',
      type: 'public',
      createdAt: new Date(),
      createdBy: 'system',
      members: []  // Public channel, no explicit members needed
    });
  }
}

// Create a new conversation
export async function createConversation(userId1, userId2) {
  const conversationRef = doc(collection(db, 'conversations'));
  await setDoc(conversationRef, {
    participantIds: [userId1, userId2],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessage: null,
    lastMessageAt: null
  });
  return conversationRef.id;
}

// Create a new channel
export async function createChannel(name, description, type, createdBy) {
  const channelRef = doc(collection(db, 'channels'));
  await setDoc(channelRef, {
    name,
    description,
    type, // 'public' or 'private'
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: type === 'private' ? [createdBy] : []
  });
  return channelRef.id;
} 