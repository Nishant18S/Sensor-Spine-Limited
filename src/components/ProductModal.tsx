import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Tag, Package, ExternalLink } from 'lucide-react';

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

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setCurrentSlide(0);
    setIsLoading(true);
    setImageErrors({});
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % product.images.length);
    setIsLoading(true);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + product.images.length) % product.images.length);
    setIsLoading(true);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
    setIsLoading(false);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'text-purple-400',
      red: 'text-red-400',
      amber: 'text-amber-400',
      cyan: 'text-cyan-400',
      violet: 'text-violet-400'
    };
    return colors[color] || 'text-cyan-400';
  };

  const getBgColorClass = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'bg-purple-500/10 border-purple-500/20',
      red: 'bg-red-500/10 border-red-500/20',
      amber: 'bg-amber-500/10 border-amber-500/20',
      cyan: 'bg-cyan-500/10 border-cyan-500/20',
      violet: 'bg-violet-500/10 border-violet-500/20'
    };
    return colors[color] || 'bg-cyan-500/10 border-cyan-500/20';
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently added';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 md:p-6 overflow-auto"
      onClick={onClose}
    >
      <div
        className="max-w-5xl w-full bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Slider */}
        <div className="relative h-[300px] md:h-[420px] bg-black/80">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {product.images.map((img, idx) => (
              <div key={idx} className="min-w-full h-full relative flex items-center justify-center">
                {imageErrors[idx] ? (
                  <div className="flex flex-col items-center justify-center text-zinc-500">
                    <Package className="w-16 h-16 mb-2" />
                    <p className="text-sm">Image not available</p>
                  </div>
                ) : (
                  <img
                    src={img}
                    alt={`${product.title} - ${idx + 1}`}
                    className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                      isLoading && idx === currentSlide ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={idx === currentSlide ? handleImageLoad : undefined}
                    onError={() => handleImageError(idx)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Navigation */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all text-white text-2xl backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all text-white text-2xl backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all text-white backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white">
              {currentSlide + 1} / {product.images.length}
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className={`${getBgColorClass(product.color)} backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border`}>
              <span className="text-xl">{getCategoryIcon(product.category)}</span>
              <span className={`text-sm font-semibold ${getColorClass(product.color)}`}>
                {product.category.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-space-grotesk text-white mb-3">
                {product.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Added: {formatDate(product.createdAt)}</span>
                </div>
                {product.updatedAt && product.updatedAt !== product.createdAt && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Updated: {formatDate(product.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
            <p className="text-zinc-300 text-[16px] leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {/* Features Section */}
          {product.features && product.features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                ✨ Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-zinc-300 group">
                    <div className={`w-2 h-2 ${getColorClass(product.color)} rounded-full mt-2`} />
                    <span className="flex-1 text-sm group-hover:text-white transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications Section */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                ⚙️ Technical Specifications
              </h3>
              <div className={`${getBgColorClass(product.color)} rounded-2xl p-6 border`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-zinc-400 text-sm font-medium">{key}</span>
                      <span className="text-white font-semibold text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="pt-6 border-t border-zinc-800">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    onClose();
                  }
                }}
                className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-zinc-950 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Request a Demo</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-2xl transition-all"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-zinc-500 text-center mt-4">
              Have questions about {product.title}? Contact our sales team for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;