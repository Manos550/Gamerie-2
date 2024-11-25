import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { User } from '../types';
import { toast } from 'react-toastify';

export const updateProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
    toast.success('Profile updated successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    toast.error(errorMessage);
    throw error;
  }
};

export const uploadProfileImage = async (
  userId: string,
  file: File,
  type: 'profile' | 'background'
): Promise<string> => {
  try {
    const fileRef = ref(storage, `users/${userId}/${type}-${Date.now()}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    
    // Update user profile with new image URL
    await updateProfile(userId, {
      [type === 'profile' ? 'profileImage' : 'backgroundImage']: url
    });
    
    return url;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
    toast.error(errorMessage);
    throw error;
  }
};

export const deleteProfileImage = async (
  userId: string,
  imageUrl: string,
  type: 'profile' | 'background'
): Promise<void> => {
  try {
    // Delete from storage
    const fileRef = ref(storage, imageUrl);
    await deleteObject(fileRef);
    
    // Update profile to remove image URL
    await updateProfile(userId, {
      [type === 'profile' ? 'profileImage' : 'backgroundImage']: null
    });
    
    toast.success('Image deleted successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete image';
    toast.error(errorMessage);
    throw error;
  }
};

export const deleteProfile = async (userId: string): Promise<void> => {
  try {
    // Delete user document
    await deleteDoc(doc(db, 'users', userId));
    
    // Clean up storage (profile and background images)
    const storageRef = ref(storage, `users/${userId}`);
    try {
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting user storage:', error);
    }
    
    toast.success('Profile deleted successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete profile';
    toast.error(errorMessage);
    throw error;
  }
};