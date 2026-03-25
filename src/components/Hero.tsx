import React, { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const scrollToProducts = () => {
    const element = document.querySelector("#products");
    if (element) {
      const yOffset = -80;
      const y =
        (element as HTMLElement).getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050b18]">

      {/* 🔬 GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* 🧬 DNA WAVE EFFECT */}
      <svg
        className="absolute w-full h-full opacity-20"
        viewBox="0 0 1440 600"
        fill="none"
      >
        <path
          d="M0 300 Q360 100 720 300 T1440 300"
          stroke="cyan"
          strokeWidth="2"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0 300 Q360 100 720 300 T1440 300;
              M0 300 Q360 500 720 300 T1440 300;
              M0 300 Q360 100 720 300 T1440 300
            "
          />
        </path>

        <path
          d="M0 320 Q360 500 720 320 T1440 320"
          stroke="purple"
          strokeWidth="2"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0 320 Q360 500 720 320 T1440 320;
              M0 320 Q360 100 720 320 T1440 320;
              M0 320 Q360 500 720 320 T1440 320
            "
          />
        </path>
      </svg>

      {/* 🔥 Glow blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 blur-3xl opacity-20 rounded-full" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 blur-3xl opacity-20 rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-x-3 bg-white/5 backdrop-blur-xl px-5 py-2 rounded-3xl text-sm mb-6 border border-white/10 text-white">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            EST. 2026 • BHUBANESWAR
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white tracking-tight">
            SENSORS THAT <br />
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              POWER THE FUTURE
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-xl leading-relaxed">
            <span className="text-white font-semibold">SENSORSPINE</span> builds
            intelligent sensor ecosystems enabling next-generation solutions across{" "}
            <span className="text-cyan-400">
              AgriTech, HealthTech, EduTech, IoT Systems & AI/ML platforms
            </span>.
          </p>

          <button
            onClick={scrollToProducts}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-black rounded-2xl font-semibold hover:scale-105 transition shadow-xl"
          >
            Browse Inaugural Products →
          </button>
        </div>

        {/* RIGHT - CARD CAROUSEL */}
        <div className="relative hidden md:flex justify-center items-center h-[420px]">

          <div className="relative w-full max-w-[420px] h-[300px]">

            {images.map((img, index) => {
              const offset = index - current;

              let transform = "translateX(0) scale(1)";
              let zIndex = 0;
              let opacity = 0;

              if (offset === 0) {
                transform = "translateX(0) scale(1)";
                zIndex = 30;
                opacity = 1;
              } else if (offset === -1 || offset === images.length - 1) {
                transform = "translateX(-140px) scale(0.9)";
                zIndex = 20;
                opacity = 0.5;
              } else if (offset === 1 || offset === -(images.length - 1)) {
                transform = "translateX(140px) scale(0.9)";
                zIndex = 20;
                opacity = 0.5;
              } else {
                transform = "scale(0.8)";
                opacity = 0;
              }

              return (
                <img
                  key={index}
                  src={img}
                  alt="tech"
                  className="absolute w-full h-full object-cover rounded-3xl border border-white/10 shadow-2xl transition-all duration-700 ease-in-out"
                  style={{
                    transform,
                    zIndex,
                    opacity,
                  }}
                />
              );
            })}

            {/* Glow */}
            <div className="absolute -inset-10 bg-gradient-to-br from-cyan-400/20 to-teal-400/10 rounded-[3rem] blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;