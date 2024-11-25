import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useAuthStore } from './store';
import { User, UserRole } from '../types';
import { toast } from 'react-toastify';

export const signUp = async (
  email: string,
  password: string,
  username: string,
  role: UserRole = 'user'
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Send email verification
    await sendEmailVerification(userCredential.user);

    const newUser: User = {
      id: uid,
      email,
      username,
      role,
      gamesPlayed: [],
      teams: [],
      achievements: [],
      stats: {
        wins: 0,
        losses: 0,
        draws: 0,
        tournamentWins: 0,
        matchesPlayed: 0
      },
      followers: [],
      following: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', uid), {
      ...newUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    toast.success('Welcome to Gamerie! Please check your email for verification.');
    return newUser;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    toast.error(errorMessage);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    if (!userCredential.user.emailVerified) {
      toast.warning('Please verify your email address');
    }

    toast.success('Welcome back to Gamerie!');
    return userDoc.data() as User;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    toast.error(errorMessage);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    useAuthStore.getState().logout();
    toast.success('Successfully logged out');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Logout failed';
    toast.error(errorMessage);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
    toast.error(errorMessage);
    throw error;
  }
};

export const initializeAuth = (): void => {
  onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          useAuthStore.getState().setUser(userDoc.data() as User);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        useAuthStore.getState().setUser(null);
      }
    } else {
      useAuthStore.getState().setUser(null);
    }
  });
};