import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

dotenv.config();

const app = express();

/* ================= ROOT ROUTE ================= */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 SensorSpine Backend is Running!',
    endpoints: {
      products: '/api/products',
      health: '/api/health',
      config: '/api/config'
    }
  });
});

/* ================= IMPORTANT FIX (CORS FOR DEPLOY) ================= */
app.use(cors({
  origin: '*', // allow all (important for Vercel frontend)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

/* ================= CONFIG ================= */
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

/* ================= CLOUDINARY ================= */
let upload;
let cloudinaryConfigured = false;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'sensorspine/products',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
  });

  upload = multer({ storage });
  cloudinaryConfigured = true;
} else {
  upload = multer({ storage: multer.memoryStorage() });
}

/* ================= MONGODB ================= */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

/* ================= SCHEMA ================= */
const productSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  images: [String],
  features: [String],
  deployableLink: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

/* ================= ROUTES ================= */

// Config
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    baseUrl: API_BASE_URL
  });
});

// Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔥 ADD THIS (YOU WERE MISSING THIS ROUTE)
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create product
app.post('/api/products', upload.array('images', 5), async (req, res) => {
  try {
    const { title, category, description } = req.body;

    let images = [];

    if (req.files) {
      images = req.files.map(file =>
        cloudinaryConfigured
          ? file.path
          : `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      );
    }

    const product = new Product({
      title,
      category,
      description,
      images
    });

    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
