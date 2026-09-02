import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tripora_media',
    allowed_formats: ['jpg', 'png', 'jpeg', 'heic'],
    transformation: [{ width: 2048, crop: 'limit' }]
  } as any
});

export const uploadMedia = multer({ storage });
