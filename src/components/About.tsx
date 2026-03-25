import React from "react";
import { Sprout, Cpu, Brain, Droplets } from "lucide-react";

const About: React.FC = () => {
  return (
    <section id="about" className="relative pt-16 pb-28 bg-[#050b18] overflow-hidden">

      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Glow */}
      <div className="absolute top-24 left-20 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT VIDEO */}
          <div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-xl">
              <video
                src="https://ibles-content.tinkercad.com/static/tinkercad/marketing/home/hero-homepage-2000.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[360px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-sm text-cyan-400">
                • Real-Time Intelligence
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="max-w-xl">

            <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
              EST. 2026 • BHUBANESWAR, ODISHA
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl font-semibold text-white leading-tight">
              We are the backbone <br />
              of <span className="text-cyan-400">smart sensing</span>
            </h2>

            <div className="mt-6 space-y-4 text-gray-300 text-base leading-relaxed">
              <p>
                <span className="text-white font-medium">SENSORSPINE</span> is a
                Bhubaneswar-based deep-tech company engineering advanced sensor
                systems across{" "}
                <span className="text-cyan-400">
                  AgriTech, HealthTech, EduTech, IoT and AI/ML platforms
                </span>.
              </p>

              <p>
                We design intelligent ecosystems that connect physical
                environments with digital intelligence — enabling real-time
                monitoring, predictive analytics, and automation.
              </p>

              <p>
                Every product below was unveiled during our{" "}
                <span className="text-white font-medium">2026 inauguration</span>,
                and all systems are now{" "}
                <span className="text-cyan-400 font-medium">
                  fully functional and production-ready
                </span>.
              </p>
            </div>

            {/* 🔥 PROFESSIONAL ICON FEATURES */}
            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition">
                <Sprout className="text-cyan-400 w-5 h-5" />
                <span className="text-sm text-gray-300">Soil Intelligence</span>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition">
                <Cpu className="text-cyan-400 w-5 h-5" />
                <span className="text-sm text-gray-300">IoT Sensors</span>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition">
                <Brain className="text-cyan-400 w-5 h-5" />
                <span className="text-sm text-gray-300">AI Analytics</span>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition">
                <Droplets className="text-cyan-400 w-5 h-5" />
                <span className="text-sm text-gray-300">Smart Irrigation</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default About;