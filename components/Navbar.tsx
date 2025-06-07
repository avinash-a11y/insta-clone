"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Home, Search, PlusSquare, Heart, User, LogOut, X } from "lucide-react";
import { BASE_URL } from "@/utils/config";

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>({ users: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
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
          <div ref={searchRef} className="hidden md:block flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-sm placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Searching...
                  </div>
                ) : (
                  <>
                    {searchResults.users.length === 0 && searchResults.posts.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No results found
                      </div>
                    ) : (
                      <>
                        {searchResults.users.length > 0 && (
                          <div className="border-b border-gray-200 dark:border-gray-700">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                              Users
                            </div>
                            {searchResults.users.map((user: any) => (
                              <div 
                                key={user._id} 
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                onClick={() => navigateToSearchResult(`/profile/${user.username}`)}
                              >
                                <div className="flex items-center">
                                  <img 
                                    src={user.profilePicture || "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"} 
                                    alt={user.username} 
                                    className="w-8 h-8 rounded-full mr-2"
                                  />
                                  <span className="text-gray-900 dark:text-gray-200">{user.username}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {searchResults.posts.length > 0 && (
                          <div>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                              Posts
                            </div>
                            {searchResults.posts.map((post: any) => (
                              <div 
                                key={post._id} 
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                onClick={() => navigateToSearchResult(`/posts/${post._id}`)}
                              >
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded mr-2 overflow-hidden">
                                    <img 
                                      src={post.image} 
                                      alt="" 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-gray-900 dark:text-gray-200 text-sm font-medium">@{post.username}</span>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs truncate w-64">{post.caption}</p>
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
              <Link href="/" className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                <Home className="h-6 w-6" />
              </Link>
              <Link href={"/add/post/" + username} className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname.startsWith('/add/post') ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                <PlusSquare className="h-6 w-6" />
              </Link>
              <Link href={"/liked"} className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/liked' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
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
        {/* Mobile Search */}
        <div className="px-4 py-2">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-sm placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </form>
        </div>

        {username ? (
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
              Home
            </Link>
            <Link href={"/add/post/" + username} className={`block px-3 py-2 rounded-md text-base font-medium ${pathname.startsWith('/add/post') ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
              Add Post
            </Link>
            <Link href="/liked" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/liked' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
              Liked Posts
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