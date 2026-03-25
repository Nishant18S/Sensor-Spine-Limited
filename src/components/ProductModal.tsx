import React, { useState, useEffect, useCallback } from 'react';

interface Product {
  _id: string;
  title: string;
  category: string;
  color: string;
  description: string;
  images: string[];
  features?: string[];
  specifications?: Record<string, string>;
  deployableLink?: string; // NEW: Optional deployable link
  createdAt?: string;
  updatedAt?: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconPackage = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconExternalLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconLink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// ─── Category Config ──────────────────────────────────────────────────────────

const categoryConfig: Record<string, { color: string; dim: string; border: string; text: string; gradient: string; icon: React.FC<{size?:number}> }> = {
  AriTech: {
    color: '#10b981', dim: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)',
    text: '#6ee7b7', gradient: 'linear-gradient(135deg,#10b981,#059669)',
    icon: ({ size = 16 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12" /><path d="M12 12C12 12 7 9.5 7 5.5a5 5 0 0 1 10 0c0 4-5 6.5-5 6.5z" />
        <path d="M5 22c0-3.87 3.13-7 7-7s7 3.13 7 7" />
      </svg>
    ),
  },
  HealthTech: {
    color: '#f43f5e', dim: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.25)',
    text: '#fda4af', gradient: 'linear-gradient(135deg,#f43f5e,#e11d48)',
    icon: ({ size = 16 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  EduTech: {
    color: '#f59e0b', dim: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)',
    text: '#fcd34d', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    icon: ({ size = 16 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  IoT: {
    color: '#06b6d4', dim: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)',
    text: '#67e8f9', gradient: 'linear-gradient(135deg,#06b6d4,#0284c7)',
    icon: ({ size = 16 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="6" rx="1" /><rect x="9" y="16" width="6" height="6" rx="1" />
        <rect x="2" y="9" width="6" height="6" rx="1" /><rect x="16" y="9" width="6" height="6" rx="1" />
        <path d="M15 5h1a2 2 0 0 1 2 2v1M15 19h1a2 2 0 0 0 2-2v-1M9 5H8a2 2 0 0 0-2 2v1M9 19H8a2 2 0 0 1-2-2v-1" />
      </svg>
    ),
  },
  'AI/ML': {
    color: '#8b5cf6', dim: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)',
    text: '#c4b5fd', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    icon: ({ size = 16 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
};

const fallbackCfg = categoryConfig['AI/ML'];

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently added';

// ─── Main Modal ───────────────────────────────────────────────────────────────

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [slide, setSlide] = useState(0);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'specs'>('overview');
  // Track which image indexes have already fully loaded — no spinner for those
  const loadedSet = React.useRef<Set<number>>(new Set());

  useEffect(() => {
    setSlide(0);
    setImgErrors({});
    setActiveTab('overview');
    loadedSet.current = new Set();
    setImgLoading(true); // first image of a new product always needs to load
  }, [product]);

  // Helper: navigate to a specific slide index
  const goToSlide = useCallback((idx: number) => {
    setSlide(idx);
    // Only show spinner if that image hasn't finished loading yet
    setImgLoading(!loadedSet.current.has(idx));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const go = useCallback((dir: number) => {
    if (!product) return;
    const next = ((slide + dir) + product.images.length) % product.images.length;
    goToSlide(next);
  }, [product, slide, goToSlide]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, go, onClose]);

  if (!isOpen || !product) return null;

  const cfg = categoryConfig[product.category] || fallbackCfg;
  const CatIcon = cfg.icon;
  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;
  const hasDeployableLink = product.deployableLink && product.deployableLink.trim() !== '';

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.96) translateY(16px) }
          to   { opacity:1; transform:scale(1)    translateY(0) }
        }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        .pm-thumb::-webkit-scrollbar { height: 4px }
        .pm-thumb::-webkit-scrollbar-track { background: transparent }
        .pm-thumb::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px }
        .pm-content::-webkit-scrollbar { width: 4px }
        .pm-content::-webkit-scrollbar-track { background: transparent }
        .pm-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px }
        .pm-tab-btn { transition: color 0.2s, border-color 0.2s; }
        .pm-spec-row:hover { background: rgba(255,255,255,0.03); }
        .pm-link-btn {
          transition: all 0.2s cubic-bezier(.22,1,.36,1);
        }
        .pm-link-btn:hover {
          transform: translateX(2px);
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          animation: 'fadeIn 0.2s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          fontFamily: '"Inter","SF Pro Display",system-ui,sans-serif',
        }}
      >
        {/* Modal */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 960,
            background: '#0d0f14',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)`,
            animation: 'modalIn 0.3s cubic-bezier(.22,1,.36,1)',
            display: 'flex', flexDirection: 'column',
            maxHeight: 'calc(100vh - 32px)',
          }}
        >
          {/* ── Top Layout: Image + Info ────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'row', minHeight: 0 }}>

            {/* LEFT — Image Pane */}
            <div style={{ width: '50%', minWidth: 0, flexShrink: 0, position: 'relative', background: '#080a0e', display: 'flex', flexDirection: 'column' }}>

              {/* Main Image */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 300 }}>
                <div style={{ display: 'flex', height: '100%', transition: 'transform 0.45s cubic-bezier(.22,1,.36,1)', transform: `translateX(-${slide * 100}%)` }}>
                  {product.images.map((src, i) => (
                    <div key={i} style={{ minWidth: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {imgErrors[i] ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#2a2d38' }}>
                          <IconPackage />
                          <span style={{ fontSize: 13, color: '#3a3f52' }}>Image unavailable</span>
                        </div>
                      ) : (
                        <img
                          src={src}
                          alt={`${product.title} ${i + 1}`}
                          style={{
                            maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                            transition: 'opacity 0.3s',
                            opacity: (imgLoading && i === slide) ? 0 : 1,
                          }}
                          onLoad={() => {
                            loadedSet.current.add(i);
                            if (i === slide) setImgLoading(false);
                          }}
                          onError={() => {
                            loadedSet.current.add(i);
                            setImgErrors(p => ({ ...p, [i]: true }));
                            if (i === slide) setImgLoading(false);
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Gradient vignette */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 65%)', pointerEvents: 'none' }} />

                {/* Loading spinner */}
                {imgLoading && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', border: `3px solid ${cfg.border}`, borderTopColor: cfg.color, animation: 'spin 0.8s linear infinite' }} />
                  </div>
                )}

                {/* Prev / Next */}
                {product.images.length > 1 && (
                  <>
                    {[-1, 1].map(dir => (
                      <button
                        key={dir}
                        onClick={() => go(dir)}
                        style={{
                          position: 'absolute', top: '50%',
                          [dir === -1 ? 'left' : 'right']: 14,
                          transform: 'translateY(-50%)',
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.55)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.8)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
                      >
                        {dir === -1 ? <IconChevronLeft /> : <IconChevronRight />}
                      </button>
                    ))}
                  </>
                )}

                {/* Counter pill */}
                {product.images.length > 1 && (
                  <div style={{
                    position: 'absolute', bottom: 14, right: 14,
                    padding: '4px 10px', borderRadius: 100,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600,
                  }}>
                    {slide + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="pm-thumb" style={{ display: 'flex', gap: 8, padding: '10px 14px', overflowX: 'auto', background: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>
                  {product.images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      style={{
                        width: 52, height: 40, borderRadius: 8, flexShrink: 0,
                        overflow: 'hidden', cursor: 'pointer', padding: 0,
                        border: `2px solid ${i === slide ? cfg.color : 'rgba(255,255,255,0.07)'}`,
                        transition: 'border-color 0.2s',
                        background: '#080a0e',
                      }}
                    >
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Details Pane */}
            <div className="pm-content" style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '28px 28px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: 16, right: 16, zIndex: 10,
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#aaa', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#aaa'; }}
              >
                <IconX />
              </button>

              {/* Category badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: cfg.dim, border: `1px solid ${cfg.border}`, color: cfg.text, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 14, alignSelf: 'flex-start' }}>
                <CatIcon size={13} />
                {product.category}
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: '#f0f2f8', margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                {product.title}
              </h1>

              {/* Deployable Link Button - NEW */}
              {hasDeployableLink && (
                <a
                  href={product.deployableLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pm-link-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 14px',
                    borderRadius: 100,
                    background: 'rgba(34,212,142,0.12)',
                    border: '1px solid rgba(34,212,142,0.25)',
                    color: '#22d48e',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    marginBottom: 14,
                    width: 'fit-content',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(34,212,142,0.2)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(34,212,142,0.12)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <IconLink />
                  <span>Live Demo / Project Link</span>
                  <IconExternalLink />
                </a>
              )}

              {/* Meta row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 22 }}>
                {[
                  { icon: <IconCalendar />, label: `Added ${formatDate(product.createdAt)}` },
                  ...(product.updatedAt && product.updatedAt !== product.createdAt
                    ? [{ icon: <IconRefresh />, label: `Updated ${formatDate(product.updatedAt)}` }]
                    : []),
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4a5168', fontSize: 12 }}>
                    {m.icon}
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 22 }} />

              {/* Tabs */}
              {hasSpecs && (
                <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {(['overview', 'specs'] as const).map(tab => (
                    <button
                      key={tab}
                      className="pm-tab-btn"
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '8px 18px',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        background: 'none', border: 'none',
                        borderBottom: `2px solid ${activeTab === tab ? cfg.color : 'transparent'}`,
                        color: activeTab === tab ? cfg.text : '#4a5168',
                        marginBottom: -1, letterSpacing: '0.01em',
                        textTransform: 'capitalize',
                      }}
                    >
                      {tab === 'overview' ? 'Overview' : 'Specifications'}
                    </button>
                  ))}
                </div>
              )}

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  <p style={{ fontSize: 14, color: '#7a8099', lineHeight: 1.75, margin: '0 0 24px', whiteSpace: 'pre-wrap' }}>
                    {product.description}
                  </p>

                  {product.features && product.features.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <div style={{ width: 20, height: 1, background: cfg.color }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: cfg.text }}>
                          Key Features
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {product.features.map((f, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex', alignItems: 'flex-start', gap: 10,
                              padding: '10px 12px', borderRadius: 10,
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.05)',
                            }}
                          >
                            <div style={{
                              width: 18, height: 18, borderRadius: '50%',
                              background: cfg.dim, border: `1px solid ${cfg.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, marginTop: 1, color: cfg.text,
                            }}>
                              <IconCheck />
                            </div>
                            <span style={{ fontSize: 13, color: '#c0c8de', lineHeight: 1.5 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && hasSpecs && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {Object.entries(product.specifications!).map(([key, val], i) => (
                      <div
                        key={key}
                        className="pm-spec-row"
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '11px 16px',
                          borderBottom: i < Object.keys(product.specifications!).length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                          transition: 'background 0.15s',
                        }}
                      >
                        <span style={{ fontSize: 13, color: '#4a5168', fontWeight: 500 }}>{key}</span>
                        <span style={{ fontSize: 13, color: '#c0c8de', fontWeight: 600, textAlign: 'right', maxWidth: '55%' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacer */}
              <div style={{ flex: 1, minHeight: 24 }} />
            </div>
          </div>

          {/* ── Footer CTA ─────────────────────────────────── */}
          <div style={{
            padding: '18px 28px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.015)',
            display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <button
              onClick={() => {
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                onClose();
              }}
              style={{
                flex: 1, minWidth: 160, padding: '13px 24px', borderRadius: 12,
                background: cfg.gradient, border: 'none',
                color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.01em',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'opacity 0.2s, transform 0.2s',
                boxShadow: `0 8px 24px ${cfg.dim}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <IconSend />
              
            </button>

            {hasDeployableLink && (
              <a
                href={product.deployableLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, minWidth: 140, padding: '13px 24px', borderRadius: 12,
                  background: 'rgba(34,212,142,0.1)',
                  border: '1px solid rgba(34,212,142,0.2)',
                  color: '#22d48e', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,212,142,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,212,142,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <IconExternalLink />
                View Demo
              </a>
            )}

            <button
              onClick={onClose}
              style={{
                flex: 1, minWidth: 120, padding: '13px 24px', borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: '#7a8099', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#c0c8de'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#7a8099'; }}
            >
              Dismiss
            </button>

            <p style={{ fontSize: 12, color: '#3a4055', margin: 0, flex: '0 1 auto', whiteSpace: 'nowrap' }}>
              Questions about <strong style={{ color: '#4a5168' }}>{product.title}</strong>? Reach our team.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;