import React from "react";

const projects = [
  {
    title: "Kisan Seva Platform",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
    desc: "A digital platform enabling farmers to access schemes, buy/sell products, and manage finances efficiently.",
    tech: ["PHP", "MySQL", "AI"],
  },
  {
    title: "Smart Soil Monitoring",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800",
    desc: "IoT-based system for real-time soil nutrient analysis using NPK sensors and predictive insights.",
    tech: ["Arduino", "IoT", "Sensors"],
  },
  {
    title: "AI Public Service Chatbot",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    desc: "Multilingual chatbot powered by Bhashini API to simplify access to government services.",
    tech: ["AI", "NLP", "APIs"],
  },
];

const CaseStudies = () => {
  return (
    <section
      id="case-studies"
      className="relative pt-16 pb-28 bg-[#050b18] overflow-hidden"
    >

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
            CASE STUDIES
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold text-white mt-4">
            Projects & Innovations
          </h2>

          <p className="mt-4 text-gray-400">
            Real-world solutions engineered by SENSORSPINE across agriculture,
            AI, IoT and public service ecosystems.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:border-cyan-400/40"
            >

              {/* IMAGE */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-5">

                <h3 className="text-lg font-semibold text-white">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {project.desc}
                </p>

                {/* TECH STACK */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-cyan-400/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-400/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button className="mt-5 text-cyan-400 text-sm hover:underline">
                  View Case Study →
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;