"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md transition-colors ${
          theme === "light" 
            ? "bg-white text-yellow-500 shadow-sm" 
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-5 w-5" />
      </button>
      
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md transition-colors ${
          theme === "dark" 
            ? "bg-gray-700 text-blue-400 shadow-sm" 
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-5 w-5" />
      </button>
      
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md transition-colors ${
          theme === "system" 
            ? "bg-white dark:bg-gray-700 text-purple-500 shadow-sm" 
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        aria-label="System theme"
      >
        <Laptop className="h-5 w-5" />
      </button>
    </div>
  );
} 