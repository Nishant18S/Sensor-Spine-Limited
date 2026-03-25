import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050b18] border-t border-white/10 pt-20 pb-10">

      <div className="max-w-7xl mx-auto px-6">

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">

          {/* LOGO + ABOUT */}
          <div>
            <div className="flex items-center gap-3 mb-4">

              {/* LOGO */}
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-xl flex items-center justify-center">
                <span className="text-black font-bold">SS</span>
              </div>

              <h3 className="text-xl font-semibold text-white">
                SENSORSPINE
              </h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              SENSORSPINE is a deep-tech company based in Bhubaneswar,
              building intelligent solutions across AgriTech, HealthTech,
              IoT, AI/ML and robotics systems.
            </p>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>

            <div className="space-y-3 text-sm text-gray-400">

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 mt-1" />
                <span>
                  Flat No-301, 3rd Floor,<br />
                  Archid Shree Heritage,<br />
                  Khandagiri, Bhubaneswar,<br />
                  Odisha, India
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                info@sensorspine.com
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                +91 9876543210
              </div>

            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>

            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="#about" className="hover:text-cyan-400">About</a>
              <a href="#offerings" className="hover:text-cyan-400">Offerings</a>
              <a href="#industries" className="hover:text-cyan-400">Industries</a>
              <a href="#products" className="hover:text-cyan-400">Products</a>
              <a href="#blog" className="hover:text-cyan-400">Blog</a>
              <a href="#careers" className="hover:text-cyan-400">Careers</a>
              <a href="#contact" className="hover:text-cyan-400">Contact</a>
            </div>
          </div>

        </div>

        {/* GOOGLE MAP */}
        <div className="mb-12 rounded-2xl overflow-hidden border border-white/10">
          <iframe
            title="location"
            src="https://maps.google.com/maps?q=Khandagiri%20Bhubaneswar&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[250px] border-0"
            loading="lazy"
          ></iframe>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">

          <p>© 2026 SENSORSPINE Technologies Pvt. Ltd. All rights reserved.</p>

          <p>
            Made with <span className="text-red-500">❤️</span> in Bhubaneswar, Odisha
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;