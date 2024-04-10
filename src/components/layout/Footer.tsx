import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="mt-16 sm:mt-20 mx-auto max-w-screen-xl px-3 sm:px-4 mb-6 sm:mb-8">
      <div className="allerchef-card shadow-2xl p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* About AllerChef */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src={logo} alt="AllerChef" className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-lg sm:text-xl font-bold allerchef-text-gradient">AllerChef</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Discover delicious recipes tailored for your allergies and nutritional goals.
              Your trusted companion for allergy-friendly cooking with expert guidance.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="p-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Quick Links</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <Link to="/recipes" className="block text-muted-foreground hover:text-primary transition-colors footer-quick-link">
                Find Recipes
              </Link>
              <Link to="/dieticians" className="block text-muted-foreground hover:text-primary transition-colors footer-quick-link">
                Expert Dieticians
              </Link>
              <Link to="/blogs" className="block text-muted-foreground hover:text-primary transition-colors footer-quick-link">
                Health Articles
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors footer-quick-link">
                About Us
              </Link>
              <Link to="/auth" className="block text-muted-foreground hover:text-primary transition-colors footer-quick-link">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Contact</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span className="break-all">hello@allerchef.com</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span>+91 00000 00000</span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 text-muted-foreground">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="break-words">Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-border mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
          <p className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1 flex-wrap">
            © 2025 AllerChef. All rights reserved. Made with
            <Heart className="inline-block h-3 w-3 sm:h-4 sm:w-4 text-red-500 animate-beat" />
            for allergy-friendly cooking.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;