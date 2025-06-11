"use client";
import Link from "next/link";
import { Instagram, Twitter, Facebook, Github, Camera, Heart, Mail, HelpCircle } from "lucide-react";
import { useTheme } from "next-themes";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  
  return (
    <footer className="bg-white dark:bg-dark-100 border-t border-gray-100 dark:border-gray-800 py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4 space-x-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Insta
              </span>
              <Camera className="h-5 w-5 text-brand-500" />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Share your moments with friends and family. Connect with people around the world through photos and stories that matter to you.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors" aria-label="Instagram">
                <Instagram size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                <Twitter size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Facebook">
                <Facebook size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="GitHub">
                <Github size={22} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors text-sm flex items-center">
                  <span className="mr-2">•</span> Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors text-sm flex items-center">
                  <span className="mr-2">•</span> Explore
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors text-sm flex items-center">
                  <span className="mr-2">•</span> Notifications
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors text-sm flex items-center">
                  <span className="mr-2">•</span> Messages
                </Link>
              </li>
            </ul>
          </div>
          
          {/* More Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors text-sm flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" /> Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors text-sm flex items-center">
                  <span className="mr-2">•</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors text-sm flex items-center">
                  <span className="mr-2">•</span> Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors text-sm flex items-center">
                  <Mail className="h-4 w-4 mr-2" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Made with
            </p>
            <Heart className="h-4 w-4 text-red-500 mx-1 animate-pulse" fill="currentColor" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Insta. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <div>
              <select 
                className="text-sm bg-gray-50 dark:bg-dark-200 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
                aria-label="Language Selector"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>
            
            <div>
              <a 
                href="#top" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 flex items-center transition-colors"
              >
                <span>Back to top</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 