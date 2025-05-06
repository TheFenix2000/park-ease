import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';

export type UserRole = 'admin' | 'inspector' | 'user' | 'guest';

// User data stored in Firestore
export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
  createdAt: number;
}

// Static lists for admins and inspectors
const ADMIN_EMAILS = ['admin@example.com', 'admin2@example.com'];
const INSPECTOR_EMAILS = ['inspector@example.com', 'inspector2@example.com'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Get user data from Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Check for redirect result on component mount
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const user = result.user;
          
          // Determine role based on email
          let role: UserRole = 'user';
          if (ADMIN_EMAILS.includes(user.email || '')) {
            role = 'admin';
          } else if (INSPECTOR_EMAILS.includes(user.email || '')) {
            role = 'inspector';
          }

          // Create or update user document in Firestore
          const userData: UserData = {
            uid: user.uid,
            email: user.email || '',
            role,
            name: user.displayName || '',
            createdAt: Date.now(),
          };

          await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
          setUserData(userData);
        }
      })
      .catch((error) => {
        console.error('Error getting redirect result:', error);
      });

    return () => unsubscribe();
  }, []);

  // Register a new user
  const register = async (email: string, password: string, name: string) => {
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Determine role based on email
      let role: UserRole = 'user';
      if (ADMIN_EMAILS.includes(email)) {
        role = 'admin';
      } else if (INSPECTOR_EMAILS.includes(email)) {
        role = 'inspector';
      }
      
      // Create user document in Firestore
      const userData: UserData = {
        uid: user.uid,
        email: user.email || email,
        role,
        name,
        createdAt: Date.now(),
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      setUserData(userData);
      
      return userData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Login an existing user
  const login = async (email: string, password: string) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      
      try {
        // First try popup
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Determine role based on email
        let role: UserRole = 'user';
        if (ADMIN_EMAILS.includes(user.email || '')) {
          role = 'admin';
        } else if (INSPECTOR_EMAILS.includes(user.email || '')) {
          role = 'inspector';
        }

        // Create or update user document in Firestore
        const userData: UserData = {
          uid: user.uid,
          email: user.email || '',
          role,
          name: user.displayName || '',
          createdAt: Date.now(),
        };

        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
        setUserData(userData);
      } catch (popupError: any) {
        // If popup is blocked, fall back to redirect
        if (popupError.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Logout the current user
  const logout = async () => {
    setError('');
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    userData,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    isAdmin: userData?.role === 'admin',
    isInspector: userData?.role === 'inspector',
    isUser: userData?.role === 'user',
    isGuest: !user,
  };
}