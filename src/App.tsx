import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Offerings from './components/Offerings';
import Industries from './components/Industries';
import CaseStudies from './components/CaseStudies';
import Products from './components/Products';
import Blog from './components/Blog';
import Careers from './components/Careers';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import Loader from './components/Loader'; // ✅ NEW

// 🔥 GLOBAL PRODUCT TYPE (KEEP CONSISTENT)
interface Product {
  id: number;
  category: string;
  color: string;
  title: string;
  description: string;
  images: string[];
  features?: string[];
  specifications?: Record<string, string>;
}

const App: React.FC = () => {
  // 🔥 LOADER STATE
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 LOADING EFFECT
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // ⏱ adjust if needed

    return () => clearTimeout(timer);
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  // 🔥 SHOW LOADER FIRST
  if (loading) return <Loader />;

  return (
    <div className="bg-zinc-950 text-white overflow-x-hidden">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section id="home" className="scroll-mt-24">
        <Hero />
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-24">
        <About />
      </section>

      {/* OFFERINGS */}
      <section id="offerings" className="scroll-mt-24">
        <Offerings />
      </section>

      {/* INDUSTRIES */}
      <section id="industries" className="scroll-mt-24">
        <Industries />
      </section>

      {/* CASE STUDIES */}
      <section id="case-studies" className="scroll-mt-24">
        <CaseStudies />
      </section>

      {/* PRODUCTS */}
      <section id="products" className="scroll-mt-24">
        <Products 
          onProductClick={openModal} // ✅ FIXED (no productsData)
        />
      </section>

      {/* BLOG */}
      <section id="blog" className="scroll-mt-24">
        <Blog />
      </section>

      {/* CAREERS */}
      <section id="careers" className="scroll-mt-24">
        <Careers />
      </section>

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>

      {/* FOOTER */}
      <Footer />

      {/* PRODUCT MODAL */}
      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default App;
