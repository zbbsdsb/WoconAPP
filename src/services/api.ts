import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { User, Trip, ItineraryItem } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const WoconAPI = {
  // --- Auth & Profile ---

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Ensure user profile exists
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: result.user.displayName || 'Explorer',
          email: result.user.email,
          avatar_url: result.user.photoURL,
          createdAt: serverTimestamp()
        });
      }
      return result.user;
    } catch (e) {
      console.error('Login error:', e);
      throw e;
    }
  },

  async logout() {
    await signOut(auth);
  },

  onAuth(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // --- Real Place Search (Nominatim) ---

  async searchPlaces(queryStr: string): Promise<Array<{ name: string, lat: number, lon: number }>> {
    if (!queryStr || queryStr.length < 3) return [];
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}&limit=5&accept-language=en`
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data.map((item: any) => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
      }));
    } catch (e) {
      console.error('Search error:', e);
      return [];
    }
  },

  // --- Trips ---

  async getPublicTrips(): Promise<Trip[]> {
    const path = 'trips';
    try {
      const q = query(
        collection(db, path), 
        where('is_public', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Trip));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async getMyTrips(): Promise<Trip[]> {
    const path = 'trips';
    if (!auth.currentUser) return [];
    try {
      const q = query(
        collection(db, path), 
        where('creator_id', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Trip));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async getTrip(id: string): Promise<Trip | null> {
    const path = `trips/${id}`;
    try {
      const docRef = doc(db, 'trips', id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      
      const trip = { id: snap.id, ...snap.data() } as Trip;
      
      // Fetch itinerary too
      const itemsRef = collection(db, 'trips', id, 'itinerary');
      const itemsSnap = await getDocs(query(itemsRef, orderBy('time', 'asc')));
      trip.itinerary = itemsSnap.docs.map(d => ({ id: d.id, ...d.data() } as ItineraryItem));
      
      return trip;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
      return null;
    }
  },

  async createTrip(tripData: Partial<Trip>): Promise<string | null> {
    const path = 'trips';
    if (!auth.currentUser) throw new Error('Must be signed in');
    try {
      const docRef = await addDoc(collection(db, path), {
        ...tripData,
        creator_id: auth.currentUser.uid,
        status: tripData.status || 'planning',
        participants: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
      return null;
    }
  },

  async addItineraryItem(tripId: string, item: Partial<ItineraryItem>) {
    const path = `trips/${tripId}/itinerary`;
    try {
      const colRef = collection(db, 'trips', tripId, 'itinerary');
      await addDoc(colRef, {
        ...item,
        order: Date.now()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
};
