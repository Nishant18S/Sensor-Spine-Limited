import React from "react";

const blogs = [
  {
    title: "Future of Smart Farming in India",
    date: "March 2026",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
    author: "Nishant Swain",
    avatar: "https://i.pravatar.cc/100?img=12",
    role: "AgriTech Researcher",
  },
  {
    title: "How AI is Transforming Healthcare",
    date: "Feb 2026",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800",
    author: "Dr. Priya Sharma",
    avatar: "https://i.pravatar.cc/100?img=5",
    role: "HealthTech Specialist",
  },
  {
    title: "IoT in Agriculture: Complete Guide",
    date: "Jan 2026",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    author: "Rahul Verma",
    avatar: "https://i.pravatar.cc/100?img=8",
    role: "IoT Engineer",
  },
  {
    title: "AI & Robotics in Modern Industry",
    date: "Dec 2025",
    image: "https://images.unsplash.com/photo-1581093588401-22c2c5b8b6e5?w=800",
    author: "Ankit Das",
    avatar: "https://i.pravatar.cc/100?img=15",
    role: "AI Engineer",
  },
];

const Blog = () => {
  return (
    <section id="blog" className="relative pt-16 pb-28 bg-[#050b18] overflow-hidden">

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
            INSIGHTS
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold text-white mt-4">
            Insights & Research
          </h2>

          <p className="mt-4 text-gray-400">
            Explore expert insights on AgriTech, AI, IoT and emerging technologies shaping the future.
          </p>
        </div>

        {/* 🔥 MARQUEE */}
        <div className="overflow-hidden relative">

          <div className="flex gap-8 animate-[scroll_20s_linear_infinite] w-max">

            {[...blogs, ...blogs].map((blog, index) => (
              <div
                key={index}
                className="w-[320px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500"
              >

                {/* IMAGE */}
                <div className="h-44 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-700"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <h3 className="text-lg font-semibold text-white">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {blog.date}
                  </p>

                  {/* AUTHOR */}
                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={blog.avatar}
                      alt={blog.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm text-white">{blog.author}</p>
                      <p className="text-xs text-gray-400">{blog.role}</p>
                    </div>
                  </div>

                  <button className="mt-4 text-cyan-400 text-sm hover:underline">
                    Read More →
                  </button>

                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* 🔥 MARQUEE KEYFRAMES */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

    </section>
  );
};

export default Blog;