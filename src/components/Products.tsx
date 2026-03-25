import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  category: string;
  color: string;
  description: string;
  images: string[];
  features?: string[];
  specifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsProps {
  onProductClick: (product: Product) => void;
  apiBaseUrl?: string;
}

const Products: React.FC<ProductsProps> = ({ onProductClick, apiBaseUrl = 'https://sensor-spine-limited-hopt.vercel.app' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sliderIndices, setSliderIndices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['All', 'AriTech', 'HealthTech', 'EduTech', 'IoT', 'AI/ML'];

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setError(null);
      const response = await fetch(`${apiBaseUrl}/api/products`);
      const data = await response.json();
      
      if (data.success && data.products) {
        setProducts(data.products);
        // Initialize slider indices for each product
        const initialIndices: Record<string, number> = {};
        data.products.forEach((product: Product) => {
          initialIndices[product._id] = 0;
        });
        setSliderIndices(initialIndices);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Cannot connect to server. Please check your connection.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh products (for real-time updates)
  const refreshProducts = async () => {
    setRefreshing(true);
    await fetchProducts();
  };

  // Listen for new product additions
  useEffect(() => {
    fetchProducts();
    
    // Listen for custom event when new product is added
    const handleProductAdded = () => {
      fetchProducts();
    };
    
    window.addEventListener('productAdded', handleProductAdded);
    
    // Also listen for storage events (if multiple tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'product_updated') {
        fetchProducts();
      }
    });
    
    return () => {
      window.removeEventListener('productAdded', handleProductAdded);
    };
  }, [apiBaseUrl]);

  // Filter products by category
  const filteredProducts = activeCategory && activeCategory !== 'All'
    ? products.filter(p => p.category === activeCategory)
    : products;

  const changeSlide = (productId: string, direction: number) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    const currentIndex = sliderIndices[productId] || 0;
    const newIndex = (currentIndex + direction + product.images.length) % product.images.length;
    setSliderIndices(prev => ({ ...prev, [productId]: newIndex }));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      AriTech: 'purple',
      HealthTech: 'red',
      EduTech: 'amber',
      IoT: 'cyan',
      'AI/ML': 'violet'
    };
    return colors[category] || 'gray';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      AriTech: '🥽',
      HealthTech: '❤️',
      EduTech: '📚',
      IoT: '📡',
      'AI/ML': '🤖'
    };
    return icons[category] || '⚡';
  };

  // Loading State
  if (loading) {
    return (
      <section id="products" className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-amber-400 text-sm font-medium tracking-widest">
                INAUGURATION 2026 • BHUBANESWAR
              </span>
              <h2 className="text-5xl font-semibold tracking-tighter font-space-grotesk mt-3">
                Our Flagship Products
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-800/50 rounded-3xl overflow-hidden animate-pulse">
                <div className="h-64 bg-zinc-700/50"></div>
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-zinc-700/50 rounded w-1/3"></div>
                  <div className="h-8 bg-zinc-700/50 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-700/50 rounded w-full"></div>
                  <div className="h-4 bg-zinc-700/50 rounded w-2/3"></div>
                  <div className="h-12 bg-zinc-700/50 rounded-xl mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section id="products" className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Connection Error</h3>
            <p className="text-zinc-400 mb-6">{error}</p>
            <div className="space-y-4">
              <button
                onClick={refreshProducts}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-zinc-950 rounded-xl font-semibold transition"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Retry Connection
              </button>
              <p className="text-xs text-zinc-500">
                Make sure your backend is running at: <code className="text-cyan-400">{apiBaseUrl}</code>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <section id="products" className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-zinc-800/50 rounded-2xl p-12 max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Products Yet</h3>
            <p className="text-zinc-400 mb-6">Be the first to add a product to our catalog!</p>
            <button
              onClick={() => window.location.href = '?admin=true'}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-zinc-950 rounded-xl font-semibold transition hover:shadow-lg"
            >
              <i className="fas fa-plus-circle mr-2"></i>
              Add First Product
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Refresh Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-amber-400 text-sm font-medium tracking-widest">
                INAUGURATION 2026 • BHUBANESWAR
              </span>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                {products.length} Products
              </span>
            </div>
            <h2 className="text-5xl font-semibold tracking-tighter font-space-grotesk mt-3">
              Our Flagship Products
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refreshProducts}
              disabled={refreshing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm transition flex items-center gap-2 disabled:opacity-50"
            >
              <i className={`fas fa-sync-alt ${refreshing ? 'animate-spin' : ''}`}></i>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <p className="text-zinc-400 max-w-xs text-sm">
              Interactive product gallery • Click arrows or tap dots to navigate
            </p>
          </div>
        </div>

        {/* Category Filters with Counts */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(cat => {
            const count = cat === 'All' 
              ? products.length 
              : products.filter(p => p.category === cat).length;
            
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === 'All' ? null : cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  (cat === 'All' && !activeCategory) || activeCategory === cat
                    ? 'bg-cyan-500 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                <span>{getCategoryIcon(cat)}</span>
                <span>{cat}</span>
                <span className={`text-xs ${
                  (cat === 'All' && !activeCategory) || activeCategory === cat
                    ? 'text-zinc-950/70'
                    : 'text-zinc-500'
                }`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => {
            const productId = product._id;
            const currentSlide = sliderIndices[productId] || 0;
            const color = getCategoryColor(product.category);
            const hasMultipleImages = product.images.length > 1;
            const createdAt = product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'Just added';

            return (
              <div
                key={productId}
                className="group bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300"
              >
                {/* Image Slider */}
                <div className="relative h-64 overflow-hidden bg-zinc-800">
                  <div
                    className="flex transition-transform duration-500 ease-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {product.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${product.title} - ${idx + 1}`}
                        className="min-w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                        }}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); changeSlide(productId, -1); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xl backdrop-blur-sm"
                      >
                        ←
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); changeSlide(productId, 1); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xl backdrop-blur-sm"
                      >
                        →
                      </button>
                    </>
                  )}

                  {/* Dots */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {product.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setSliderIndices(prev => ({ ...prev, [productId]: idx })); }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentSlide ? 'bg-cyan-400 w-6' : 'bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <div className={`bg-${color}-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1`}>
                      <span>{getCategoryIcon(product.category)}</span>
                      <span>{product.category}</span>
                    </div>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-zinc-300 text-xs px-2 py-1 rounded-full">
                    <i className="far fa-calendar-alt mr-1"></i>
                    {createdAt}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="inline-flex items-center gap-x-2 text-xs uppercase mb-3">
                    <span className={`w-2 h-2 rounded-full bg-${color}-400`}></span>
                    <span className="text-zinc-500">{product.category}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-3">{product.description}</p>
                  
                  {/* Features Preview */}
                  {product.features && product.features.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full">
                          {feature.length > 30 ? feature.substring(0, 30) + '...' : feature}
                        </span>
                      ))}
                      {product.features.length > 2 && (
                        <span className="text-xs bg-zinc-800 text-cyan-400 px-2 py-1 rounded-full">
                          +{product.features.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => onProductClick(product)}
                    className="mt-6 w-full py-3.5 text-sm font-semibold border border-white/20 hover:bg-white hover:text-zinc-950 rounded-2xl transition-all group/btn"
                  >
                    <span className="inline-flex items-center gap-2">
                      VIEW FULL DETAILS
                      <i className="fas fa-arrow-right text-xs group-hover/btn:translate-x-1 transition-transform"></i>
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredProducts.length === 0 && activeCategory && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No products in this category</h3>
            <p className="text-zinc-400">Try selecting a different category or check back later.</p>
            <button
              onClick={() => setActiveCategory(null)}
              className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
