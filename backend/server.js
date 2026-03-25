import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

dotenv.config();

const app = express();

/* ================= ROOT ================= */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 SensorSpine Backend Running',
    endpoints: {
      products: '/api/products',
      health: '/api/health'
    }
  });
});

/* ================= MIDDLEWARE ================= */
app.use(cors({ origin: '*'}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

/* ================= HELPER ================= */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

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

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

/* ================= SCHEMA ================= */
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  features: [String],
  deployableLink: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

/* ================= ROUTES ================= */

// Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Get all
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get one
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'null' || !isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid product ID' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, product });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create
app.post('/api/products', upload.array('images', 5), async (req, res) => {
  try {
    const { title, category, description } = req.body;

    // 🔥 Validation
    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title, category and description are required'
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
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

// Update
app.put('/api/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'null' || !isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid product ID' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const { title, category, description } = req.body;

    if (title) product.title = title;
    if (category) product.category = category;
    if (description) product.description = description;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file =>
        cloudinaryConfigured
          ? file.path
          : `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      );
      product.images = newImages;
    }

    await product.save();

    res.json({
      success: true,
      product,
      message: 'Product updated successfully'
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'null' || !isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid product ID' });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });

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
