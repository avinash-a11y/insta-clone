"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Home, Search, PlusSquare, Heart, User, LogOut, X, Bell, Camera } from "lucide-react";
import { BASE_URL } from "@/utils/config";
import { ThemeToggle } from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>({ users: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState<number>(2); // Example notification count
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if(storedUsername){
      setUsername(storedUsername);
    }

    // Close search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset search results when navigating to a new page
  useEffect(() => {
    setShowSearchResults(false);
    setSearchQuery("");
  }, [pathname]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], posts: [] });
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(`${BASE_URL}/api/search?query=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    router.push("/signin"); 
  };

  const navigateToSearchResult = (path: string) => {
    router.push(path);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-100 border-b border-gray-100 dark:border-gray-800 shadow-[var(--shadow-elevation-low)] backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-float">
                Insta
              </span>
              <Camera className="h-5 w-5 text-brand-500" />
            </Link>
          </div>

          {/* Search - Only on desktop */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="insta-input pl-10 pr-10 py-2 h-10"
                  placeholder="Search users or posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.users.length > 0 || searchResults.posts.length > 0 ? setShowSearchResults(true) : null}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute mt-2 w-full insta-card p-0 overflow-hidden z-10 max-h-96 overflow-y-auto animate-slide-down">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="mt-2 text-sm">Searching...</p>
                  </div>
                ) : (
                  <>
                    {searchResults.users.length === 0 && searchResults.posts.length === 0 ? (
                      <div className="p-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-dark-300 flex items-center justify-center mb-3">
                          <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">No results found</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try different keywords</p>
                      </div>
                    ) : (
                      <>
                        {searchResults.users.length > 0 && (
                          <div className="border-b border-gray-100 dark:border-gray-800">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-dark-200">
                              Users
                            </div>
                            {searchResults.users.map((user: any) => (
                              <div 
                                key={user._id} 
                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-200 cursor-pointer transition-colors"
                                onClick={() => navigateToSearchResult(`/profile/${user.username}`)}
                              >
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-dark-300 shadow-sm flex-shrink-0">
                                    <img 
                                      src={user.profilePicture || "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"} 
                                      alt={user.username} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">{user.username}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{user.fullName || "User"}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {searchResults.posts.length > 0 && (
                          <div>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-dark-200">
                              Posts
                            </div>
                            {searchResults.posts.map((post: any) => (
                              <div 
                                key={post._id} 
                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-200 cursor-pointer transition-colors"
                                onClick={() => navigateToSearchResult(`/posts/${post._id}`)}
                              >
                                <div className="flex items-center">
                                  <div className="w-12 h-12 bg-gray-100 dark:bg-dark-300 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                                    <img 
                                      src={post.image} 
                                      alt="" 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">@{post.username}</span>
                                      <span className="text-gray-400 dark:text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 truncate">{post.caption}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
              aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={isMenuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          {username ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="mr-2">
                <ThemeToggle />
              </div>
              <Link href="/" className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors ${pathname === '/' ? 'text-brand-600 dark:text-brand-400 bg-gray-50 dark:bg-dark-200' : 'text-gray-700 dark:text-gray-300'}`}>
                <Home className="h-6 w-6" />
              </Link>
              <Link href={"/add/post/" + username} className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors ${pathname.startsWith('/add/post') ? 'text-brand-600 dark:text-brand-400 bg-gray-50 dark:bg-dark-200' : 'text-gray-700 dark:text-gray-300'}`}>
                <PlusSquare className="h-6 w-6" />
              </Link>
              <Link href={"/liked"} className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors ${pathname === '/liked' ? 'text-brand-600 dark:text-brand-400 bg-gray-50 dark:bg-dark-200' : 'text-gray-700 dark:text-gray-300'}`}>
                <Heart className="h-6 w-6" />
              </Link>
              
              <NotificationBell />
              
              <Link href={`/profile/${username}`} className="flex items-center">
                <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white dark:border-dark-300 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                  <img
                    src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <div className="mr-2">
                <ThemeToggle />
              </div>
              <Link href="/signin" className="insta-button-secondary">
                Sign In
              </Link>
              <Link href="/signup" className="insta-button-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'fixed inset-0 z-50 bg-black bg-opacity-50' : 'hidden'} md:hidden`}>
        <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-dark-100 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <span className="font-bold text-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
              Insta
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <ThemeToggle />
          </div>
          
          {/* Mobile Search */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="insta-input pl-10 pr-10 py-2 h-10"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                                <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search" 
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-hidden="true" />
                <span className="sr-only">Clear search input</span>
              </button>
                )}
              </div>
            </form>
          </div>

          {username ? (
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === '/' 
                    ? 'bg-gray-100 dark:bg-dark-200 text-brand-600 dark:text-brand-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Link>
              
              <Link 
                href={"/add/post/" + username} 
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                  pathname.startsWith('/add/post') 
                    ? 'bg-gray-100 dark:bg-dark-200 text-brand-600 dark:text-brand-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <PlusSquare className="h-5 w-5 mr-3" />
                Add Post
              </Link>
              
              <Link 
                href="/liked" 
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === '/liked' 
                    ? 'bg-gray-100 dark:bg-dark-200 text-brand-600 dark:text-brand-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-5 w-5 mr-3" />
                Liked Posts
              </Link>
              
              <Link 
                href="/notifications" 
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === '/notifications' 
                    ? 'bg-gray-100 dark:bg-dark-200 text-brand-600 dark:text-brand-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell className="h-5 w-5 mr-3" />
                Notifications
                <span className="ml-auto bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  New
                </span>
              </Link>
              
              <Link 
                href={`/profile/${username}`} 
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                  pathname.startsWith('/profile') 
                    ? 'bg-gray-100 dark:bg-dark-200 text-brand-600 dark:text-brand-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="h-5 w-5 mr-3 rounded-full overflow-hidden">
                  <img
                    src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                Profile
              </Link>
              
                              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200"
                aria-label="Logout from account"
              >
                <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
                Logout
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <Link 
                href="/signin" 
                className="insta-button-secondary w-full flex justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="insta-button-primary w-full flex justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Insta
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;