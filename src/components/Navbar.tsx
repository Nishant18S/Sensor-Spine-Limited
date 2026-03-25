import React, { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Offerings", href: "#offerings" },
    { name: "Industries", href: "#industries" },
    { name: "Projects", href: "#case-studies" },
    { name: "Products", href: "#products" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      navItems.forEach((item) => {
        const section = document.querySelector(item.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActive(item.href);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    const element = document.querySelector(href);
    if (element) {
      const yOffset = -80;
      const y =
        (element as HTMLElement).getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }

    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050b18]/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">

        <div
          className={`flex items-center justify-between ${
            scrolled ? "h-14" : "h-16"
          } transition-all`}
        >

          {/* 🔥 LOGO */}
          <div
            onClick={(e) => scrollToSection(e, "#home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* SVG LOGO */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-black"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 7L2 14l10 5 10-5-10-5z" />
              </svg>
            </div>

            <span className="text-xl font-semibold tracking-tight">
              <span className="text-white">SENSOR</span>
              <span className="text-cyan-400 ml-1">SPINE</span>
            </span>
          </div>

          {/* 💻 DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`relative text-sm transition ${
                  active === item.href
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}

                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-cyan-400 transition-all ${
                    active === item.href ? "w-full" : "w-0"
                  }`}
                />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <button
              onClick={(e) => scrollToSection(e, "#contact")}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-medium hover:scale-105 transition shadow"
            >
              Get Demo
            </button>
          </div>

          {/* 📱 MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white text-2xl"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      <div
        className={`lg:hidden absolute w-full left-0 bg-[#050b18]/95 backdrop-blur-xl border-t border-white/10 transition-all duration-500 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 py-6 flex flex-col gap-5">

          {navItems.map((item, i) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={`text-lg ${
                active === item.href
                  ? "text-cyan-400"
                  : "text-gray-300 hover:text-white"
              }`}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {item.name}
            </a>
          ))}

          <button
            onClick={(e) => scrollToSection(e, "#contact")}
            className="mt-4 w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-black py-3 rounded-xl font-medium"
          >
            Request Demo
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;