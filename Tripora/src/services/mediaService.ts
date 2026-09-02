import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert, Platform } from 'react-native';
import { apiFetch } from './api';

export type TripMedia = {
  id: string;
  tripId: string;
  activityId?: string; // Optional: binds photo to activity instead of trip globally
  uri: string;
  width?: number;
  height?: number;
  size?: number;
  mimeType?: string;
  caption?: string;
  isCover?: boolean;
  createdAt: string;
  updatedAt: string;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'failed';
  uploadProgress: number;
};

export class MediaService {
  /**
   * Request Gallery Permission
   */
  async requestGalleryPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Pick multiple images using Expo Image Picker
   */
  async pickImages(multiple: boolean = false, maxSelection?: number): Promise<ImagePicker.ImagePickerResult | null> {
    const hasPermission = await this.requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'You need to grant photo library access to select pictures.');
      return null;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: multiple,
        selectionLimit: multiple && maxSelection ? maxSelection : (multiple ? 10 : 1),
        quality: 1, // original quality before manual compression
      });

      if (!result.canceled) {
        return result;
      }
      return null;
    } catch (e) {
      console.error("ImagePicker Error: ", e);
      return null;
    }
  }

  /**
   * Compress and resize an image sensibly
   */
  async compressImage(uri: string): Promise<ImageManipulator.ImageResult | null> {
    try {
      // For modern mobile: Max dimension 2048px maintains fidelity while halving size, 80% JPEG quality
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 2048 } }], 
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipResult;
    } catch (error) {
      console.warn("Image Manipulation failed, falling back to original", error);
      return { uri, width: 0, height: 0 }; 
    }
  }

  /**
   * Upload image to backend storage
   */
  async uploadImage(
    uri: string, 
    tripId: string,
    activityId?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    
    // Determine filename and mimetype
    const filename = uri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const formData = new FormData();
    // React Native needs this exact shape for FormData file objects
    formData.append('file', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: filename,
      type,
    } as any);

    try {
      if (onProgress) onProgress(30);

      const endpoint = activityId 
        ? `/api/activities/${activityId}/media`
        : `/api/trips/${tripId}/media`;

      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (onProgress) onProgress(100);

      // Backend returns the DB media object, return the URL
      return response.data.url;
    } catch (error) {
      console.error('Media upload failed:', error);
      throw new Error('Failed to upload image. Please check your connection.');
    }
  }

  async addMediaComment(mediaId: string, text: string): Promise<any> {
    const res = await apiFetch(`/api/media/${mediaId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
    return res.data;
  }

  async updateMediaCaption(mediaId: string, caption: string): Promise<any> {
    const res = await apiFetch(`/api/media/${mediaId}`, {
      method: 'PATCH',
      body: JSON.stringify({ caption })
    });
    return res.data;
  }
}

export const mediaService = new MediaService();
