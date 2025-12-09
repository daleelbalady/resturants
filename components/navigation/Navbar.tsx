import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, User, LogOut, Settings, Moon, Sun, Globe, Home, UtensilsCrossed } from 'lucide-react';
import LoginDropdown from '../LoginDropdown';

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    profilePic?: string;
    role?: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  const mainAppUrl = process.env.REACT_APP_MAIN_APP_URL || 'https://www.daleelbalady.com';

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_data');
    window.location.href = `${mainAppUrl}/login`;
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!mounted) return null;

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${scrolled
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm'
        : 'bg-white dark:bg-slate-900'
        } border-slate-200 dark:border-slate-800`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Daleel Balady"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href={mainAppUrl}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Home className="h-4 w-4 inline mr-1" />
              Main Site
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-slate-600" />
              ) : (
                <Sun className="h-5 w-5 text-slate-300" />
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium overflow-hidden">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt={user.name || 'User'} className="h-full w-full object-cover" />
                    ) : (
                      getUserInitials()
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  <div className="p-2">
                    {user.role === 'PROVIDER' && (
                      <Link
                        to={`/provider/${user.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        My Dashboard
                      </Link>
                    )}
                    <a
                      href={`${mainAppUrl}/profile/edit`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LoginDropdown />
                <a
                  href={`${mainAppUrl}/signup`}
                  className="text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors px-4 py-2 rounded-lg"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="h-6 w-6 text-slate-900 dark:text-white" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-2">
              <a
                href={mainAppUrl}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Home className="h-4 w-4 inline mr-2" />
                Main Site
              </a>

              {user ? (
                <>
                  <div className="px-4 py-3 border-t border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  {user.role === 'PROVIDER' && (
                    <Link
                      to={`/provider/${user.id}`}
                      className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Settings className="h-4 w-4 inline mr-2" />
                      My Dashboard
                    </Link>
                  )}
                  <a
                    href={`${mainAppUrl}/profile/edit`}
                    className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    Profile Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 py-2">
                    <LoginDropdown />
                  </div>
                  <a
                    href={`${mainAppUrl}/signup`}
                    className="px-4 py-2 text-sm bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors text-center font-medium"
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
