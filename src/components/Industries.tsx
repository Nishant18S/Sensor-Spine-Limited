import React from "react";
import {
  Sprout,
  HeartPulse,
  GraduationCap,
  Cpu,
  Bot,
} from "lucide-react";

const industries = [
  {
    title: "AgriTech",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
    icon: <Sprout className="w-5 h-5 text-white" />,
    desc: "Smart farming systems powered by real-time soil intelligence and precision agriculture.",
    points: ["Soil monitoring", "Smart irrigation", "Crop analytics"],
  },
  {
    title: "HealthTech",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800",
    icon: <HeartPulse className="w-5 h-5 text-white" />,
    desc: "Advanced health monitoring with wearable sensors and real-time diagnostics.",
    points: ["Wearables", "Remote care", "Health analytics"],
  },
  {
    title: "EduTech",
    image: "https://images.unsplash.com/photo-1584697964403-3b6b9c6e8d1d?w=800",
    icon: <GraduationCap className="w-5 h-5 text-white" />,
    desc: "Interactive STEM kits and AI-powered platforms for next-gen learning.",
    points: ["STEM kits", "AI learning", "Smart classrooms"],
  },
  {
    title: "IoT Systems",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    icon: <Cpu className="w-5 h-5 text-white" />,
    desc: "Connected sensor ecosystems for real-time monitoring and automation.",
    points: ["Sensor networks", "Industrial IoT", "Automation"],
  },
  {
    title: "Custom Robotics",
    image: "https://images.unsplash.com/photo-1581093588401-22c2c5b8b6e5?w=800",
    icon: <Bot className="w-5 h-5 text-white" />,
    desc: "AI-powered robotic systems designed for automation and intelligent operations.",
    points: ["Autonomous robots", "AI control", "Custom builds"],
  },
];

const Industries = () => {
  return (
    <section
      id="industries"
      className="relative pt-16 pb-28 bg-[#050b18] overflow-hidden"
    >

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
            INDUSTRIES
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold text-white mt-4">
            Industries We Serve
          </h2>

          <p className="mt-4 text-gray-400">
            Delivering intelligent solutions across agriculture, healthcare,
            education, IoT ecosystems and robotics.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {industries.map((item, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:border-cyan-400/40"
            >

              {/* IMAGE */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Icon badge */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-lg border border-white/10">
                  {item.icon}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">

                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {item.desc}
                </p>

                {/* POINTS */}
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  {item.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                      {point}
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Industries;