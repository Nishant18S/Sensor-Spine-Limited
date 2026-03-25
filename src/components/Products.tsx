import React, { useState, useEffect } from 'react';

interface Product {
  _id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  features?: string[];
  createdAt?: string;
  rating?: number;
  price?: string;
}

interface ProductsProps {
  onProductClick: (product: Product) => void;
  apiBaseUrl?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const IconRefresh = ({ spinning }: { spinning: boolean }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: spinning ? 'spin 1s linear infinite' : 'none' }}
  >
    <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconCalendar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconAlert = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Category Icons ───────────────────────────────────────────────────────────

const CategoryIcons: Record<string, React.FC<{ size?: number }>> = {
  AriTech: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" /><path d="M12 12C12 12 7 9.5 7 5.5a5 5 0 0 1 10 0c0 4-5 6.5-5 6.5z" />
      <path d="M5 22c0-3.87 3.13-7 7-7s7 3.13 7 7" />
    </svg>
  ),
  HealthTech: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  EduTech: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  IoT: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M6.3 6.3a8 8 0 0 0 0 11.4" /><path d="M17.7 6.3a8 8 0 0 1 0 11.4" />
      <path d="M3.5 3.5a13.5 13.5 0 0 0 0 17" /><path d="M20.5 3.5a13.5 13.5 0 0 1 0 17" />
    </svg>
  ),
  'AI/ML': ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
};

// ─── Category Config ──────────────────────────────────────────────────────────

const categoryConfig = {
  AriTech: {
    label: 'AgriTech',
    hex: '#10b981',
    tagBg: 'rgba(16,185,129,0.12)',
    tagBorder: 'rgba(16,185,129,0.25)',
    tagText: '#6ee7b7',
    pillBg: 'rgba(16,185,129,0.08)',
    pillBorder: 'rgba(16,185,129,0.2)',
    pillText: '#6ee7b7',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    filterBg: 'rgba(16,185,129,0.08)',
    filterBorder: 'rgba(16,185,129,0.25)',
    filterText: '#6ee7b7',
  },
  HealthTech: {
    label: 'HealthTech',
    hex: '#f43f5e',
    tagBg: 'rgba(244,63,94,0.12)',
    tagBorder: 'rgba(244,63,94,0.25)',
    tagText: '#fda4af',
    pillBg: 'rgba(244,63,94,0.08)',
    pillBorder: 'rgba(244,63,94,0.2)',
    pillText: '#fda4af',
    gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    filterBg: 'rgba(244,63,94,0.08)',
    filterBorder: 'rgba(244,63,94,0.25)',
    filterText: '#fda4af',
  },
  EduTech: {
    label: 'EduTech',
    hex: '#f59e0b',
    tagBg: 'rgba(245,158,11,0.12)',
    tagBorder: 'rgba(245,158,11,0.25)',
    tagText: '#fcd34d',
    pillBg: 'rgba(245,158,11,0.08)',
    pillBorder: 'rgba(245,158,11,0.2)',
    pillText: '#fcd34d',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    filterBg: 'rgba(245,158,11,0.08)',
    filterBorder: 'rgba(245,158,11,0.25)',
    filterText: '#fcd34d',
  },
  IoT: {
    label: 'IoT',
    hex: '#06b6d4',
    tagBg: 'rgba(6,182,212,0.12)',
    tagBorder: 'rgba(6,182,212,0.25)',
    tagText: '#67e8f9',
    pillBg: 'rgba(6,182,212,0.08)',
    pillBorder: 'rgba(6,182,212,0.2)',
    pillText: '#67e8f9',
    gradient: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    filterBg: 'rgba(6,182,212,0.08)',
    filterBorder: 'rgba(6,182,212,0.25)',
    filterText: '#67e8f9',
  },
  'AI/ML': {
    label: 'AI/ML',
    hex: '#8b5cf6',
    tagBg: 'rgba(139,92,246,0.12)',
    tagBorder: 'rgba(139,92,246,0.25)',
    tagText: '#c4b5fd',
    pillBg: 'rgba(139,92,246,0.08)',
    pillBorder: 'rgba(139,92,246,0.2)',
    pillText: '#c4b5fd',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    filterBg: 'rgba(139,92,246,0.08)',
    filterBorder: 'rgba(139,92,246,0.25)',
    filterText: '#c4b5fd',
  },
};

type CatKey = keyof typeof categoryConfig;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

const isNew = (d?: string) =>
  d ? new Date(d) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 20 }}>
    {[1, 2, 3, 4].map(i => (
      <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: '#111318', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ height: 200, background: 'linear-gradient(90deg,#1a1d24 25%,#20232b 50%,#1a1d24 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
        <div style={{ padding: '18px 20px' }}>
          {[70, 100, 85, 50].map((w, j) => (
            <div key={j} style={{ height: 12, width: `${w}%`, borderRadius: 6, background: '#1a1d24', marginBottom: 10, animation: 'shimmer 1.4s infinite' }} />
          ))}
          <div style={{ height: 36, borderRadius: 10, background: '#1a1d24', marginTop: 16, animation: 'shimmer 1.4s infinite' }} />
        </div>
      </div>
    ))}
  </div>
);

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({ product, onProductClick }: { product: Product; onProductClick: (p: Product) => void }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const cfg = categoryConfig[product.category as CatKey] || categoryConfig['AI/ML'];
  const Icon = CategoryIcons[product.category] || CategoryIcons['AI/ML'];

  const slide = (dir: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx(i => (i + dir + product.images.length) % product.images.length);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0f1117',
        border: `1px solid ${hovered ? cfg.hex + '40' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 0 0 1px ${cfg.hex}20, 0 16px 48px rgba(0,0,0,0.5)`
          : '0 1px 12px rgba(0,0,0,0.4)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Image Zone ── */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: '#0a0c10' }}>
        <img
          src={product.images[imgIdx]}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />

        {/* Bottom Fade */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: 'linear-gradient(to top, #0f1117, transparent)',
        }} />

        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 10px',
          borderRadius: 100,
          background: 'rgba(0,0,0,0.6)',
          border: `1px solid ${cfg.tagBorder}`,
          color: cfg.tagText,
          fontSize: 11,
          fontWeight: 600,
        }}>
          <Icon size={12} />
          {cfg.label}
        </div>
      </div>

      {/* ── Content Zone ── */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* ✅ Title (kept) */}
        <h3 style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#f0f2f8',
          margin: 0,
          marginBottom: 10,
        }}>
          {product.title}
        </h3>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA Button */}
        <button
          onClick={() => onProductClick(product)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 10,
            background: hovered ? cfg.gradient : 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: hovered ? '#fff' : '#9ca3af',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Products: React.FC<ProductsProps> = ({ onProductClick, apiBaseUrl = 'https://sensor-spine-limited-hopt.vercel.app' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const allKeys = Object.keys(categoryConfig) as CatKey[];

  const fetchProducts = async () => {
    try {
      setError(null);
      const res = await fetch(`${apiBaseUrl}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
      else setError('Failed to load products');
    } catch {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = activeCategory ? products.filter(p => p.category === activeCategory) : products;
  const counts = allKeys.reduce<Record<string, number>>((a, k) => {
    a[k] = products.filter(p => p.category === k).length;
    return a;
  }, {});

  return (
    <section
      id="products"
      style={{
        padding: '72px 0 96px',
        background: '#09090b',
        minHeight: '100vh',
        fontFamily: '"Plus Jakarta Sans", "DM Sans", system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes shimmer { from { background-position: 200% 0 } to { background-position: -200% 0 } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 16, height: 1, background: '#374151' }} />
              Product Catalog
            </p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#f9fafb', margin: 0, lineHeight: 1.1 }}>
              Our Products
            </h2>
            <p style={{ color: '#6b7280', fontSize: 13.5, marginTop: 8, maxWidth: 380, lineHeight: 1.65 }}>
              Cutting-edge solutions across agriculture, health, education, connectivity, and AI.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {!loading && !error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {[
                  { label: 'Products', value: products.length },
                  { label: 'Categories', value: allKeys.length },
                ].map((s, i) => (
                  <React.Fragment key={s.label}>
                    {i > 0 && <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 9.5, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
            <button
              onClick={() => { setRefreshing(true); fetchProducts(); }}
              disabled={refreshing}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#6b7280', fontSize: 12, fontWeight: 500,
                cursor: refreshing ? 'not-allowed' : 'pointer',
                opacity: refreshing ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              <IconRefresh spinning={refreshing} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, marginBottom: 32, scrollbarWidth: 'none' }}>
          {/* All */}
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 10, flexShrink: 0,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
              background: !activeCategory ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: `1px solid ${!activeCategory ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
              color: !activeCategory ? '#f9fafb' : '#6b7280',
            }}
          >
            All
            <span style={{
              fontSize: 10, fontWeight: 700,
              padding: '1px 6px', borderRadius: 100,
              background: !activeCategory ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
              color: !activeCategory ? '#d1d5db' : '#4b5563',
            }}>
              {products.length}
            </span>
          </button>

          {allKeys.map(key => {
            const c = categoryConfig[key];
            const on = activeCategory === key;
            const Icon = CategoryIcons[key];
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 14px', borderRadius: 10, flexShrink: 0,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: on ? c.filterBg : 'transparent',
                  border: `1px solid ${on ? c.filterBorder : 'rgba(255,255,255,0.07)'}`,
                  color: on ? c.filterText : '#6b7280',
                }}
              >
                {Icon && <Icon size={12} />}
                {c.label}
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: '1px 6px', borderRadius: 100,
                  background: on ? c.pillBg : 'rgba(255,255,255,0.04)',
                  color: on ? c.pillText : '#4b5563',
                }}>
                  {counts[key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', marginBottom: 16 }}>
              <IconAlert />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f9fafb', marginBottom: 6 }}>Unable to Load Products</h3>
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{error}</p>
            <button
              onClick={() => { setLoading(true); fetchProducts(); }}
              style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#f9fafb', color: '#09090b', border: 'none', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 12px' }}>🔍</div>
            <p style={{ color: '#6b7280', fontSize: 13 }}>No products found in this category.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {filtered.map(product => (
              <ProductCard key={product._id} product={product} onProductClick={onProductClick} />
            ))}
          </div>
        )}

        {/* ── Load More ── */}
        {filtered.length > 12 && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 28px', borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#6b7280', cursor: 'pointer',
            }}>
              Load More
              <IconArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
