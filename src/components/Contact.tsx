import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', company: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-5xl font-semibold tracking-tighter font-space-grotesk">
            Let's Build the Future Together
          </h2>
          <p className="mt-4 text-zinc-400">
            Bhubaneswar Head Office • Demo requests welcome
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-16 bg-zinc-900 rounded-3xl p-10 md:p-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-xs uppercase block mb-3 text-zinc-400">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-white/10 focus:border-cyan-400 rounded-3xl px-8 py-6 outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-xs uppercase block mb-3 text-zinc-400">Company / Institution</label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-white/10 focus:border-cyan-400 rounded-3xl px-8 py-6 outline-none transition-colors"
                placeholder="Your Organization"
              />
            </div>
          </div>

          <div className="mt-8">
            <label className="text-xs uppercase block mb-3 text-zinc-400">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-white/10 focus:border-cyan-400 rounded-3xl px-8 py-6 outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="mt-8">
            <label className="text-xs uppercase block mb-3 text-zinc-400">Message</label>
            <textarea
              name="message"
              rows={6}
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-white/10 focus:border-cyan-400 rounded-3xl px-8 py-6 outline-none transition-colors resize-none"
              placeholder="Tell us about your requirements..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-10 w-full bg-white hover:bg-cyan-400 text-zinc-950 py-7 text-xl font-semibold rounded-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : isSubmitted ? (
              <>
                ✓
                Message Sent!
              </>
            ) : (
              <>
                ✉️
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;