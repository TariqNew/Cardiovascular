import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          {['About', 'Support', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
            <div key={item} className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900 cursor-pointer">
                {item}
              </a>
            </div>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          {[
            { icon: 'fa-facebook', label: 'Facebook' },
            { icon: 'fa-instagram', label: 'Instagram' },
            { icon: 'fa-twitter', label: 'Twitter' },
            { icon: 'fa-youtube', label: 'YouTube' },
          ].map((social) => (
            <a key={social.label} href="#" className="text-gray-400 hover:text-gray-500 cursor-pointer">
              <span className="sr-only">{social.label}</span>
              <i className={`fab ${social.icon} text-xl`}></i>
            </a>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; 2025 CardioNutrition. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 text-center mt-2">
            In case of emergency, please call your local emergency services immediately.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;