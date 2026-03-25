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
import { productsData } from './data/productsData';
import { Product } from './types/Product'; // ✅ FIX

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="bg-zinc-950 text-white overflow-x-hidden">

      <Navbar />

      <section id="home" className="scroll-mt-24">
        <Hero />
      </section>

      <section id="about" className="scroll-mt-24">
        <About />
      </section>

      <section id="offerings" className="scroll-mt-24">
        <Offerings />
      </section>

      <section id="industries" className="scroll-mt-24">
        <Industries />
      </section>

      <section id="case-studies" className="scroll-mt-24">
        <CaseStudies />
      </section>

      <section id="products" className="scroll-mt-24">
        <Products 
          onProductClick={openModal} 
        />
      </section>

      <section id="blog" className="scroll-mt-24">
        <Blog />
      </section>

      <section id="careers" className="scroll-mt-24">
        <Careers />
      </section>

      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>

      <Footer />

      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default App;