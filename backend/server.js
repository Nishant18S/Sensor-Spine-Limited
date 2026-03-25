import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

dotenv.config();

const app = express();

// Base URL configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

// CORS configuration - allow all localhost ports for development
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow all localhost connections for development
    if (origin.match(/^http:\/\/localhost:\d+$/) || 
        origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
      return callback(null, true);
    }
    
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Cloudinary Configuration
let upload;
let cloudinaryConfigured = false;

if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name_here' &&
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_KEY !== 'your_api_key_here') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'sensorspine/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    }
  });
  
  upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
  });
  cloudinaryConfigured = true;
  console.log('✅ Cloudinary configured');
} else {
  // Memory storage fallback for testing
  const memoryStorage = multer.memoryStorage();
  upload = multer({ 
    storage: memoryStorage,
    limits: { fileSize: 5 * 1024 * 1024 }
  });
  console.log('⚠️ Cloudinary not configured. Using memory storage (images will be saved as base64)');
}

// MongoDB Product Schema with deployableLink
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['AriTech', 'HealthTech', 'EduTech', 'IoT', 'AI/ML'] },
  color: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  features: [{ type: String }],
  specifications: { type: Map, of: String },
  deployableLink: { type: String, default: null }, // NEW: Optional deployable link
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sensorspine';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// ============= API ROUTES =============

// GET base URL info
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    baseUrl: API_BASE_URL,
    apiEndpoint: `${API_BASE_URL}/api/products`,
    version: '1.0.0',
    features: {
      deployableLink: true,
      cloudinary: cloudinaryConfigured
    }
  });
});

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create new product
app.post('/api/products', upload.array('images', 5), async (req, res) => {
  try {
    const { title, category, description, features, specifications, deployableLink } = req.body;
    
    // Validate required fields
    if (!title || !category || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: title, category, description are required' 
      });
    }
    
    // Handle images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      if (cloudinaryConfigured) {
        imageUrls = req.files.map(file => file.path);
      } else {
        // For testing without Cloudinary - convert to base64
        imageUrls = req.files.map((file) => {
          return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        });
      }
    } else {
      return res.status(400).json({ success: false, error: 'At least one image is required' });
    }
    
    // Parse features and specifications
    const featuresArray = features ? JSON.parse(features) : [];
    const specsObject = specifications ? JSON.parse(specifications) : {};
    
    // Determine color based on category
    const colorMap = {
      'AriTech': 'purple',
      'HealthTech': 'red',
      'EduTech': 'amber',
      'IoT': 'cyan',
      'AI/ML': 'violet'
    };
    
    // Validate deployableLink if provided
    let validatedLink = null;
    if (deployableLink && deployableLink.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (urlPattern.test(deployableLink) || deployableLink.startsWith('http')) {
        validatedLink = deployableLink;
      } else {
        // If it's not a valid URL but provided, store it anyway but add https:// prefix if missing
        validatedLink = deployableLink.startsWith('http') ? deployableLink : `https://${deployableLink}`;
      }
    }
    
    const product = new Product({
      title,
      category,
      color: colorMap[category] || 'cyan',
      description,
      images: imageUrls,
      features: featuresArray,
      specifications: specsObject,
      deployableLink: validatedLink
    });
    
    await product.save();
    
    console.log(`✅ Product created: ${title} (${category})${validatedLink ? ` - Demo: ${validatedLink}` : ''}`);
    
    res.status(201).json({ 
      success: true, 
      product,
      message: 'Product created successfully!'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update product
app.put('/api/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { title, category, description, features, specifications, existingImages, deployableLink } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Update basic fields
    if (title) product.title = title;
    if (category) {
      product.category = category;
      const colorMap = {
        'AriTech': 'purple',
        'HealthTech': 'red',
        'EduTech': 'amber',
        'IoT': 'cyan',
        'AI/ML': 'violet'
      };
      product.color = colorMap[category] || 'cyan';
    }
    if (description) product.description = description;
    if (features) product.features = JSON.parse(features);
    if (specifications) product.specifications = JSON.parse(specifications);
    
    // Update deployable link
    if (deployableLink !== undefined) {
      if (deployableLink && deployableLink.trim()) {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (urlPattern.test(deployableLink) || deployableLink.startsWith('http')) {
          product.deployableLink = deployableLink;
        } else {
          product.deployableLink = deployableLink.startsWith('http') ? deployableLink : `https://${deployableLink}`;
        }
      } else {
        product.deployableLink = null;
      }
    }
    
    // Handle images
    let finalImages = [];
    
    // Keep existing images
    if (existingImages) {
      finalImages = JSON.parse(existingImages);
    }
    
    // Add new images
    if (req.files && req.files.length > 0) {
      let newImageUrls;
      if (cloudinaryConfigured) {
        newImageUrls = req.files.map(file => file.path);
      } else {
        newImageUrls = req.files.map((file) => {
          return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        });
      }
      finalImages = [...finalImages, ...newImageUrls];
    }
    
    if (finalImages.length > 0) {
      product.images = finalImages;
    }
    
    product.updatedAt = new Date();
    await product.save();
    
    console.log(`✅ Product updated: ${product.title}`);
    
    res.json({ success: true, product, message: 'Product updated successfully!' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Delete images from Cloudinary if configured
    if (cloudinaryConfigured) {
      for (const imageUrl of product.images) {
        try {
          // Extract public ID from Cloudinary URL
          const matches = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
          if (matches && matches[1]) {
            const publicId = matches[1];
            await cloudinary.uploader.destroy(publicId);
            console.log(`🗑️ Deleted image: ${publicId}`);
          }
        } catch (err) {
          console.log('Could not delete image from Cloudinary:', err.message);
        }
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    console.log(`🗑️ Product deleted: ${product.title}`);
    
    res.json({ success: true, message: 'Product deleted successfully!' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    baseUrl: API_BASE_URL,
    port: process.env.PORT || 5000,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cloudinaryConfigured: cloudinaryConfigured,
    features: {
      deployableLink: true
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: `Route ${req.method} ${req.url} not found` 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n=================================');
  console.log(`🚀 SENSORSPINE Backend Server`);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/products`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n✅ CORS enabled for all localhost ports`);
  console.log(`✅ MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`✅ Cloudinary: ${cloudinaryConfigured ? 'Configured' : 'Not configured (using base64 for testing)'}`);
  console.log(`✅ Features: Deployable Links Enabled`);
  console.log('=================================\n');
});