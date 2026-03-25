import React, { useEffect, useRef } from "react";

const Loader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = 200;
    const H = canvas.height = 200;
    const cx = W / 2;
    const cy = H / 2;

    let frame = 0;
    let raf: number;

    // Infinity / figure-8 parametric path
    // x = A * cos(t) / (1 + sin²(t))
    // y = A * sin(t)*cos(t) / (1 + sin²(t))
    const lemniscate = (t: number, A: number) => ({
      x: cx + (A * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t)),
      y: cy + (A * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t)),
    });

    const NODES = 14;         // strand node pairs
    const TRAIL = 90;         // particle trail length
    const A = 68;             // lemniscate scale

    // Two offset particles tracing the path to form the double strand
    const offset1 = 0;
    const offset2 = Math.PI; // opposite side

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const t = (frame * 0.022);

      // ── Draw lemniscate guide path (faint) ────────────────
      ctx.beginPath();
      for (let i = 0; i <= 300; i++) {
        const angle = (i / 300) * Math.PI * 2;
        const p = lemniscate(angle, A);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(0,210,220,0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Draw particle trails ───────────────────────────────
      for (let strand = 0; strand < 2; strand++) {
        const baseAngle = strand === 0 ? t + offset1 : t + offset2;

        for (let j = TRAIL; j >= 0; j--) {
          const age = j / TRAIL;
          const angle = baseAngle - j * 0.018;
          const p = lemniscate(angle, A);

          const alpha = (1 - age) * 0.9;
          const r = (1 - age) * 4.5 + 0.5;

          // Color shift: strand 0 = cyan, strand 1 = teal/violet blend
          let color: string;
          if (strand === 0) {
            color = `rgba(0,230,240,${alpha})`;
          } else {
            color = `rgba(80,180,255,${alpha})`;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }

        // Bright head particle
        const headP = lemniscate(baseAngle, A);
        const grd = ctx.createRadialGradient(headP.x, headP.y, 0, headP.x, headP.y, 9);
        if (strand === 0) {
          grd.addColorStop(0, "rgba(0,255,255,1)");
          grd.addColorStop(0.4, "rgba(0,200,230,0.8)");
          grd.addColorStop(1, "rgba(0,150,200,0)");
        } else {
          grd.addColorStop(0, "rgba(100,200,255,1)");
          grd.addColorStop(0.4, "rgba(60,160,240,0.8)");
          grd.addColorStop(1, "rgba(40,120,200,0)");
        }
        ctx.beginPath();
        ctx.arc(headP.x, headP.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // ── Draw cross-strand connectors (DNA rungs) ──────────
      for (let i = 0; i < NODES; i++) {
        const angle1 = t + offset1 - i * (Math.PI * 2 / NODES);
        const angle2 = t + offset2 - i * (Math.PI * 2 / NODES);
        const p1 = lemniscate(angle1, A);
        const p2 = lemniscate(angle2, A);

        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        // Only draw rung when strands are near each other (crossing zone = center)
        const proximity = Math.max(0, 1 - dist / 90);
        if (proximity > 0.15) {
          const alpha = proximity * 0.55;
          const grd = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grd.addColorStop(0, `rgba(0,230,240,${alpha})`);
          grd.addColorStop(0.5, `rgba(150,220,255,${alpha * 1.4})`);
          grd.addColorStop(1, `rgba(80,180,255,${alpha})`);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = grd;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Node dots on rung endpoints
          [p1, p2].forEach((p, si) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = si === 0
              ? `rgba(0,240,255,${proximity * 0.8})`
              : `rgba(100,200,255,${proximity * 0.8})`;
            ctx.fill();
          });
        }
      }

      // ── Outer glow ring (subtle pulse) ────────────────────
      const pulse = 0.3 + 0.08 * Math.sin(frame * 0.04);
      const outerGrd = ctx.createRadialGradient(cx, cy, 60, cx, cy, 95);
      outerGrd.addColorStop(0, `rgba(0,200,220,0)`);
      outerGrd.addColorStop(0.7, `rgba(0,180,210,${pulse * 0.12})`);
      outerGrd.addColorStop(1, `rgba(0,150,200,0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.fillStyle = outerGrd;
      ctx.fill();

      frame++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#050b18",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif",
      }}
    >
      {/* Subtle radial bg glow */}
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,180,210,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Canvas animation */}
      <canvas
        ref={canvasRef}
        style={{
          width: 200,
          height: 200,
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Brand text */}
      <div style={{ marginTop: 28, textAlign: "center", position: "relative", zIndex: 1 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#00e5f0" }}>SENSOR</span>
          <span style={{ color: "#ffffff" }}>SPINE</span>
        </h1>

        {/* Animated underline bar */}
        <div
          style={{
            margin: "8px auto 0",
            height: 2,
            width: 80,
            borderRadius: 2,
            background:
              "linear-gradient(90deg, transparent, #00e5f0, #50b4ff, transparent)",
            animation: "slideBar 2.2s ease-in-out infinite",
          }}
        />

        <p
          style={{
            marginTop: 14,
            fontSize: 12,
            color: "rgba(160,190,210,0.7)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            animation: "fadeText 2s ease-in-out infinite alternate",
          }}
        >
          Initializing Smart Systems
        </p>
      </div>

      <style>{`
        @keyframes slideBar {
          0%   { transform: scaleX(0.3); opacity: 0.4; }
          50%  { transform: scaleX(1);   opacity: 1;   }
          100% { transform: scaleX(0.3); opacity: 0.4; }
        }
        @keyframes fadeText {
          from { opacity: 0.4; }
          to   { opacity: 1;   }
        }
      `}</style>
    </div>
  );
};

export default Loader;
import React, { useEffect, useRef } from "react";

const Loader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = 200;
    const H = canvas.height = 200;
    const cx = W / 2;
    const cy = H / 2;

    let frame = 0;
    let raf: number;

    // Infinity / figure-8 parametric path
    // x = A * cos(t) / (1 + sin²(t))
    // y = A * sin(t)*cos(t) / (1 + sin²(t))
    const lemniscate = (t: number, A: number) => ({
      x: cx + (A * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t)),
      y: cy + (A * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t)),
    });

    const NODES = 14;         // strand node pairs
    const TRAIL = 90;         // particle trail length
    const A = 68;             // lemniscate scale

    // Two offset particles tracing the path to form the double strand
    const offset1 = 0;
    const offset2 = Math.PI; // opposite side

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const t = (frame * 0.022);

      // ── Draw lemniscate guide path (faint) ────────────────
      ctx.beginPath();
      for (let i = 0; i <= 300; i++) {
        const angle = (i / 300) * Math.PI * 2;
        const p = lemniscate(angle, A);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(0,210,220,0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Draw particle trails ───────────────────────────────
      for (let strand = 0; strand < 2; strand++) {
        const baseAngle = strand === 0 ? t + offset1 : t + offset2;

        for (let j = TRAIL; j >= 0; j--) {
          const age = j / TRAIL;
          const angle = baseAngle - j * 0.018;
          const p = lemniscate(angle, A);

          const alpha = (1 - age) * 0.9;
          const r = (1 - age) * 4.5 + 0.5;

          // Color shift: strand 0 = cyan, strand 1 = teal/violet blend
          let color: string;
          if (strand === 0) {
            color = `rgba(0,230,240,${alpha})`;
          } else {
            color = `rgba(80,180,255,${alpha})`;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }

        // Bright head particle
        const headP = lemniscate(baseAngle, A);
        const grd = ctx.createRadialGradient(headP.x, headP.y, 0, headP.x, headP.y, 9);
        if (strand === 0) {
          grd.addColorStop(0, "rgba(0,255,255,1)");
          grd.addColorStop(0.4, "rgba(0,200,230,0.8)");
          grd.addColorStop(1, "rgba(0,150,200,0)");
        } else {
          grd.addColorStop(0, "rgba(100,200,255,1)");
          grd.addColorStop(0.4, "rgba(60,160,240,0.8)");
          grd.addColorStop(1, "rgba(40,120,200,0)");
        }
        ctx.beginPath();
        ctx.arc(headP.x, headP.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // ── Draw cross-strand connectors (DNA rungs) ──────────
      for (let i = 0; i < NODES; i++) {
        const angle1 = t + offset1 - i * (Math.PI * 2 / NODES);
        const angle2 = t + offset2 - i * (Math.PI * 2 / NODES);
        const p1 = lemniscate(angle1, A);
        const p2 = lemniscate(angle2, A);

        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        // Only draw rung when strands are near each other (crossing zone = center)
        const proximity = Math.max(0, 1 - dist / 90);
        if (proximity > 0.15) {
          const alpha = proximity * 0.55;
          const grd = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grd.addColorStop(0, `rgba(0,230,240,${alpha})`);
          grd.addColorStop(0.5, `rgba(150,220,255,${alpha * 1.4})`);
          grd.addColorStop(1, `rgba(80,180,255,${alpha})`);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = grd;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Node dots on rung endpoints
          [p1, p2].forEach((p, si) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = si === 0
              ? `rgba(0,240,255,${proximity * 0.8})`
              : `rgba(100,200,255,${proximity * 0.8})`;
            ctx.fill();
          });
        }
      }

      // ── Outer glow ring (subtle pulse) ────────────────────
      const pulse = 0.3 + 0.08 * Math.sin(frame * 0.04);
      const outerGrd = ctx.createRadialGradient(cx, cy, 60, cx, cy, 95);
      outerGrd.addColorStop(0, `rgba(0,200,220,0)`);
      outerGrd.addColorStop(0.7, `rgba(0,180,210,${pulse * 0.12})`);
      outerGrd.addColorStop(1, `rgba(0,150,200,0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.fillStyle = outerGrd;
      ctx.fill();

      frame++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#050b18",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif",
      }}
    >
      {/* Subtle radial bg glow */}
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,180,210,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Canvas animation */}
      <canvas
        ref={canvasRef}
        style={{
          width: 200,
          height: 200,
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Brand text */}
      <div style={{ marginTop: 28, textAlign: "center", position: "relative", zIndex: 1 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#00e5f0" }}>SENSOR</span>
          <span style={{ color: "#ffffff" }}>SPINE</span>
        </h1>

        {/* Animated underline bar */}
        <div
          style={{
            margin: "8px auto 0",
            height: 2,
            width: 80,
            borderRadius: 2,
            background:
              "linear-gradient(90deg, transparent, #00e5f0, #50b4ff, transparent)",
            animation: "slideBar 2.2s ease-in-out infinite",
          }}
        />

        <p
          style={{
            marginTop: 14,
            fontSize: 12,
            color: "rgba(160,190,210,0.7)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            animation: "fadeText 2s ease-in-out infinite alternate",
          }}
        >
          Initializing Smart Systems
        </p>
      </div>

      <style>{`
        @keyframes slideBar {
          0%   { transform: scaleX(0.3); opacity: 0.4; }
          50%  { transform: scaleX(1);   opacity: 1;   }
          100% { transform: scaleX(0.3); opacity: 0.4; }
        }
        @keyframes fadeText {
          from { opacity: 0.4; }
          to   { opacity: 1;   }
        }
      `}</style>
    </div>
  );
};

export default Loader;