import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, User, Search, Users, BookOpen } from 'lucide-react';
import logo from '@/assets/logo.png';
import AuthModal from '@/pages/Auth';
import { useAuthStore } from '@/context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(window.scrollY);
  const { isLoggedIn, logout, deleteAccount } = useAuthStore();
  const [, forceUpdate] = useState(0);
  // console.log('[DEBUG] isLoggedIn:', isLoggedIn);

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
    logout();
    setShowProfileMenu(false);
    forceUpdate(n => n + 1);
    window.location.href = '/'; // Force full reload and redirect to home
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setShowProfileMenu(false);
    alert('Account deleted.');
    forceUpdate(n => n + 1);
    window.location.href = '/'; // Force full reload and redirect to home
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
        className={`sticky top-2 sm:top-4 z-50 mx-auto max-w-screen-xl px-3 sm:px-4 transition-transform duration-300 ${showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'}`}
      >
        <div className="allerchef-card flex items-center justify-between shadow-2xl px-3 sm:px-6 py-2 sm:py-3" >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src={logo} alt="AllerChef" className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="text-lg sm:text-xl lg:text-2xl font-bold allerchef-text-gradient">AllerChef</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm lg:text-base ${isActive(item.path)
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
                className="allerchef-btn-primary px-4 sm:px-6 py-2 rounded-xl font-semibold text-sm lg:text-base ml-2"
                onClick={() => setShowAuthModal(true)}
              >
                Sign Up
              </button>
            ) : (
              <div className="relative ml-2">
                <button
                  className="allerchef-btn-secondary px-4 sm:px-6 py-2 rounded-xl font-semibold text-sm lg:text-base flex items-center gap-2"
                  onClick={() => setShowProfileMenu((v) => !v)}
                  onBlur={() => setTimeout(() => setShowProfileMenu(false), 150)}
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" /> Profile
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
                    <button
                      className="block w-full text-left px-5 py-3 hover:bg-gray-100 text-gray-800 font-medium rounded-t-xl"
                      onClick={() => {
                        // console.log('[DEBUG] Logout button clicked');
                        logout();
                        setShowProfileMenu(false);
                      }}
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

          {/* Tablet Navigation (simplified) */}
          <nav className="hidden md:flex lg:hidden items-center gap-2">
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-1 px-2 py-2 rounded-lg font-medium transition-all duration-300 text-xs ${isActive(item.path)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-foreground hover:bg-secondary hover:text-accent'
                  }`}
              >
                <item.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            ))}
            {isLoggedIn && (
              <Link
                to="/saved"
                className={`flex items-center gap-1 px-2 py-2 rounded-lg font-medium transition-all duration-300 text-xs ${isActive('/saved')
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-foreground hover:bg-secondary hover:text-accent'
                  }`}
              >
                <Heart className="h-3 w-3" />
                <span className="hidden sm:inline">Saved</span>
              </Link>
            )}
            {!isLoggedIn ? (
              <button
                className="allerchef-btn-primary px-3 py-2 rounded-lg font-semibold text-xs ml-1"
                onClick={() => setShowAuthModal(true)}
              >
                Sign Up
              </button>
            ) : (
              <div className="relative ml-1">
                <button
                  className="allerchef-btn-secondary px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-1"
                  onClick={() => setShowProfileMenu((v) => !v)}
                  onBlur={() => setTimeout(() => setShowProfileMenu(false), 150)}
                >
                  <User className="h-3 w-3" />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border z-50">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 font-medium rounded-t-xl text-sm"
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                    >
                      Log Out
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-medium rounded-b-xl text-sm"
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
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 allerchef-card">
            <nav className="flex flex-col gap-1 p-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
              {/* Auth/Profile Button Mobile */}
              {!isLoggedIn ? (
                <button
                  className="allerchef-btn-primary px-6 py-3 rounded-xl font-semibold text-sm mt-2"
                  onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }}
                >
                  Sign Up
                </button>
              ) : (
                <div className="relative mt-2">
                  <button
                    className="allerchef-btn-secondary px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 w-full"
                    onClick={() => setShowProfileMenu((v) => !v)}
                    onBlur={() => setTimeout(() => setShowProfileMenu(false), 150)}
                  >
                    <User className="h-4 w-4" /> Profile
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
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} clearFieldsOnClose />
    </>
  );
};

export default Header;