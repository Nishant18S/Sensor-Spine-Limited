import React, { useEffect, useState } from "react";

const offerings = [
  {
    title: "AgriTech Solutions",
    images: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800",
    ],
    desc: "Precision farming, soil intelligence, crop monitoring and smart irrigation systems.",
  },
  {
    title: "HealthTech Systems",
    images: [
      "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800",
    ],
    desc: "Wearable sensors, real-time health monitoring and remote diagnostics platforms.",
  },
  {
    title: "IoT Sensor Networks",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
      "https://images.unsplash.com/photo-1581093588401-22c2c5b8b6e5?w=800",
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    ],
    desc: "Connected devices, industrial IoT systems and real-time sensor ecosystems.",
  },
  {
    title: "AI/ML Platforms",
    images: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
      "https://images.unsplash.com/photo-1507149833265-60c372daea22?w=800",
    ],
    desc: "AI analytics, automation platforms and intelligent decision-making systems.",
  },
  {
    title: "3D Printing & Robotics",
    images: [
      "https://images.unsplash.com/photo-1581092334394-5e7d3b8c8c3c?w=800",
      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800",
      "https://images.unsplash.com/photo-1581093588401-22c2c5b8b6e5?w=800",
    ],
    desc: "Advanced manufacturing, rapid prototyping, and intelligent robotic automation systems.",
  },
];

const Offerings: React.FC = () => {
  const [indices, setIndices] = useState(offerings.map(() => 0));

  // Auto carousel inside each card
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices((prev) =>
        prev.map((val, i) => (val + 1) % offerings[i].images.length)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="offerings" className="relative pt-16 pb-28 bg-[#050b18]">

      {/* Background */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
            OUR SOLUTIONS
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold text-white mt-4">
            Intelligent Systems We Build
          </h2>

          <p className="mt-4 text-gray-400">
            We engineer scalable solutions across AgriTech, HealthTech, EduTech,
            IoT Systems, AI/ML platforms, 3D printing and robotics.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {offerings.map((item, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500"
            >

              {/* IMAGE CAROUSEL */}
              <div className="relative h-48 overflow-hidden">

                {item.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
                      i === indices[index] ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              </div>

              {/* CONTENT */}
              <div className="p-5">

                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {item.desc}
                </p>

                <button
                  className="mt-4 text-cyan-400 text-sm hover:underline"
                  onClick={() => {
                    const el = document.querySelector("#products");
                    if (el) {
                      const yOffset = -80;
                      const y =
                        (el as HTMLElement).getBoundingClientRect().top +
                        window.pageYOffset +
                        yOffset;

                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                >
                  Explore →
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Offerings;