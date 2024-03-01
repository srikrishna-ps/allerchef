import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="mt-20 mx-auto max-w-screen-xl px-4">
      <div className="allerchef-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About AllerChef */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="AllerChef" className="h-8 w-8" />
              <span className="text-xl font-bold allerchef-text-gradient">AllerChef</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover delicious recipes tailored for your allergies and nutritional goals. 
              Your trusted companion for allergy-friendly cooking with expert guidance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/recipes" className="block text-muted-foreground hover:text-primary transition-colors">
                Find Recipes
              </Link>
              <Link to="/dieticians" className="block text-muted-foreground hover:text-primary transition-colors">
                Expert Dieticians
              </Link>
              <Link to="/blogs" className="block text-muted-foreground hover:text-primary transition-colors">
                Health Articles
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/auth" className="block text-muted-foreground hover:text-primary transition-colors">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                hello@allerchef.com
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                San Francisco, CA
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 AllerChef. All rights reserved. Made with ❤️ for allergy-friendly cooking.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;