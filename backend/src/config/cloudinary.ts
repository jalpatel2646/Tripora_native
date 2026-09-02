import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { AppError } from '../utils/AppError';

dotenv.config();

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

if (!cloud_name || !api_key || !api_secret) {
  console.error("Missing Cloudinary Configuration. File uploads will fail.");
} else {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret
  });
}

export default cloudinary;
