"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Search, PlusSquare, Heart, User, LogOut } from "lucide-react";

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if(storedUsername){
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    router.push("/signin"); 
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Insta
              </span>
            </Link>
          </div>

          {/* Search - Only on desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-sm placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          {username ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/home' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                <Home className="h-6 w-6" />
              </Link>
              <Link href={"/add/post/" + username} className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/add' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                <PlusSquare className="h-6 w-6" />
              </Link>
              <Link href="/notifications" className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/notifications' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                <Heart className="h-6 w-6" />
              </Link>
              <Link href={`/profile/${username}`} className="flex items-center">
                <img
                  src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/signin" className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                Sign In
              </Link>
              <Link href="/signup" className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-2`}>
        {username ? (
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/home" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/home' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
              Home
            </Link>
            <Link href={"/add/post/" + username} className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/add' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
              Add Post
            </Link>
            <Link href="/notifications" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/notifications' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
              Notifications
            </Link>
            <Link href={`/profile/${username}`} className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/profile') ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/signin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              Sign In
            </Link>
            <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-500 text-white hover:bg-blue-600">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 