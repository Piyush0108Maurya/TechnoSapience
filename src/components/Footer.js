import React from 'react';
import { Instagram, Linkedin, MessageCircle } from 'lucide-react';

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/aiec_iitm', icon: Instagram },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/aiec-iitm', icon: Linkedin },
  { name: 'WhatsApp', href: 'https://wa.me/1234567890', icon: MessageCircle },
];

const quickLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
];

const Footer = () => {
  const scrollToSection = (id) => {
    if (id === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
   <footer className="bg-deep-dark border-t border-red-500/20 relative overflow-hidden z-0">
 <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(45deg, #ff1a1a 25%, transparent 25%),
          linear-gradient(-45deg, #ff1a1a 25%, transparent 25%)
        `,
        backgroundSize: '20px 20px',
      }}></div>

      <div className="relative py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                {/*<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-bright-red p-1 bg-gray-900 shadow-lg">
                  <img 
                    src={aiecLogo} 
                    alt="AIEC IITM Logo" 
                    className="w-full h-full object-cover" 
                  />
                </div> */}
                <div className="w-full">
                  <span className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-bright-red to-red-500 bg-clip-text text-transparent">
                    AIEC IITM
                  </span>
                  <div className="text-xs sm:text-sm text-gray-400 font-condensed">ARTIFICIAL.INTELLIGENCE.HUB</div>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6 max-w-md mx-auto sm:mx-0">
                Artificial Intelligence & Entrepreneurship Cell at IITM Janakpuri, fostering innovation, 
                collaboration, and cutting-edge technology solutions for tomorrow's challenges.
              </p>

              <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="group relative w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 hover:bg-gradient-to-br hover:from-bright-red hover:to-red-600 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 overflow-hidden"
                    aria-label={social.name}
                  >
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-full"></div>
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors relative z-10" />
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute inset-0 rounded-full bg-bright-red/20 blur-lg animate-pulse"></div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h3 className="text-white font-display font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Quick Links</h3>
              <ul className="space-y-3 sm:space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button 
                      onClick={() => scrollToSection(link.href)}
                      className="text-sm sm:text-base text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center justify-center sm:justify-start space-x-2 group w-full"
                    >
                      <div className="w-1 h-1 bg-gray-600 group-hover:bg-cyan-400 rounded-full transition-colors"></div>
                      <span>{link.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div className="text-center sm:text-left">
              <h3 className="text-white font-display font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Get in Touch</h3>
              <div className="space-y-4">
                <div className="text-gray-400">
                  <div className="font-medium text-white mb-1 text-sm sm:text-base">IITM Janakpuri</div>
                  <div className="text-xs sm:text-sm">New Delhi, India</div>
                </div>
                <div className="text-gray-400">
                  <div className="font-medium text-white mb-1 text-sm sm:text-base">Email</div>
                  <div className="text-xs sm:text-sm break-all">aiec@iitm.ac.in</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-red-500/20 mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
                © 2025 AIEC IITM. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-xs sm:text-sm">
                <span className="text-gray-500 font-condensed hidden sm:inline">
                  POWERED.BY.ARTIFICIAL.INTELLIGENCE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;