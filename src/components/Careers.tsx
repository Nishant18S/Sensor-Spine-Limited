import React from "react";
import { Briefcase, MapPin, Clock } from "lucide-react";

const jobs = [
  {
    role: "Frontend Developer",
    type: "Full-time",
    location: "Remote",
    desc: "Build modern, responsive web interfaces using React, Tailwind and advanced UI techniques.",
  },
  {
    role: "IoT Engineer",
    type: "Internship",
    location: "On-site",
    desc: "Develop sensor-based systems, embedded solutions and real-time IoT data pipelines.",
  },
  {
    role: "AI/ML Engineer",
    type: "Full-time",
    location: "Hybrid",
    desc: "Design AI models, automation systems and predictive analytics platforms.",
  },
];

const Careers = () => {
  return (
    <section
      id="careers"
      className="relative pt-16 pb-28 bg-[#050b18] overflow-hidden"
    >

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
            CAREERS
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold text-white mt-4">
            Join Our Team
          </h2>

          <p className="mt-4 text-gray-400">
            Be part of SENSORSPINE and build next-generation solutions across
            AI, IoT, robotics and smart sensing technologies.
          </p>
        </div>

        {/* JOB CARDS */}
        <div className="grid md:grid-cols-2 gap-8">

          {jobs.map((job, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:-translate-y-2 transition-all duration-300 hover:border-cyan-400/40"
            >

              {/* ROLE */}
              <h3 className="text-xl font-semibold text-white">
                {job.role}
              </h3>

              {/* META */}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">

                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  {job.type}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {job.location}
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Immediate Joiner
                </div>

              </div>

              {/* DESCRIPTION */}
              <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                {job.desc}
              </p>

              {/* ACTIONS */}
              <div className="mt-6 flex gap-4">

                <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-medium hover:scale-105 transition">
                  Apply Now
                </button>

                <button className="px-5 py-2 rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 transition">
                  View Details
                </button>

              </div>

              {/* HOVER LINE */}
              <div className="mt-5 h-[2px] w-0 bg-cyan-400 group-hover:w-full transition-all duration-300" />

            </div>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="mt-20 text-center">

          <p className="text-gray-400">
            Don’t see a role that fits you?
          </p>

          <button className="mt-4 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition">
            Send Your Resume →
          </button>

        </div>

      </div>
    </section>
  );
};

export default Careers;