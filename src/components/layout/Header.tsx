import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, User, Search, Users, BookOpen } from 'lucide-react';
import logo from '@/assets/logo.png';
import AuthModal from '@/pages/Auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('allerchef_user'));
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem('allerchef_user'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 32) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('allerchef_user');
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('allerchef_user');
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    navigate('/');
    alert('Account deleted.');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Search },
    { name: 'Recipes', path: '/recipes', icon: Search },
    { name: 'Dieticians', path: '/dieticians', icon: Users },
    { name: 'Blogs', path: '/blogs', icon: BookOpen },
  ];
  if (isLoggedIn) {
    navItems.push({ name: 'Saved', path: '/saved', icon: Heart });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={`sticky top-4 z-50 mx-auto max-w-screen-xl px-4 transition-transform duration-300 ${showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'}`}
      >
        <div className="allerchef-card flex items-center justify-between shadow-2xl" >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="AllerChef" className="h-10 w-10" />
            <span className="text-2xl font-bold allerchef-text-gradient">AllerChef</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive(item.path)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-foreground hover:bg-secondary hover:text-accent'
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            {/* Auth/Profile Button */}
            {!isLoggedIn ? (
              <button
                className="allerchef-btn-primary px-6 py-2 rounded-xl font-semibold text-base ml-2"
                onClick={() => setShowAuthModal(true)}
              >
                Sign Up
              </button>
            ) : (
              <div className="relative ml-2">
                <button
                  className="allerchef-btn-secondary px-6 py-2 rounded-xl font-semibold text-base flex items-center gap-2"
                  onClick={() => setShowProfileMenu((v) => !v)}
                  onBlur={() => setTimeout(() => setShowProfileMenu(false), 150)}
                >
                  <User className="h-5 w-5" /> Profile
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
                    <button
                      className="block w-full text-left px-5 py-3 hover:bg-gray-100 text-gray-800 font-medium rounded-t-xl"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                    <button
                      className="block w-full text-left px-5 py-3 hover:bg-red-100 text-red-600 font-medium rounded-b-xl"
                      onClick={handleDeleteAccount}
                    >
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 allerchef-card">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              {/* Auth/Profile Button Mobile */}
              {!isLoggedIn ? (
                <button
                  className="allerchef-btn-primary px-6 py-3 rounded-xl font-semibold text-base mt-2"
                  onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }}
                >
                  Sign Up
                </button>
              ) : (
                <div className="relative mt-2">
                  <button
                    className="allerchef-btn-secondary px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-2 w-full"
                    onClick={() => setShowProfileMenu((v) => !v)}
                    onBlur={() => setTimeout(() => setShowProfileMenu(false), 150)}
                  >
                    <User className="h-5 w-5" /> Profile
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
                      <button
                        className="block w-full text-left px-5 py-3 hover:bg-gray-100 text-gray-800 font-medium rounded-t-xl"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                      <button
                        className="block w-full text-left px-5 py-3 hover:bg-red-100 text-red-600 font-medium rounded-b-xl"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Header;