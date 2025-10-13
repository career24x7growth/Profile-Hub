import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Storage for Multer + Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "user_profiles",
    format: "png",
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  }),
});


const upload = multer({ storage });

export default upload;
