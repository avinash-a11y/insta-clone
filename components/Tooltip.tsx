"use client";

import { useState, useRef, useEffect, ReactNode } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}

const Tooltip = ({ content, children, position = 'top', delay = 300, className = '' }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate tooltip position based on the target element
  const calculatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top - tooltipRect.height - 8 + scrollY;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2) + scrollX;
        break;
      case 'bottom':
        top = targetRect.bottom + 8 + scrollY;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2) + scrollX;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2) + scrollY;
        left = targetRect.left - tooltipRect.width - 8 + scrollX;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2) + scrollY;
        left = targetRect.right + 8 + scrollX;
        break;
    }

    // Keep tooltip within viewport boundaries
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < 8 + scrollX) {
      left = 8 + scrollX;
    } else if (left + tooltipRect.width > viewportWidth - 8 + scrollX) {
      left = viewportWidth - tooltipRect.width - 8 + scrollX;
    }

    if (top < 8 + scrollY) {
      top = 8 + scrollY;
    } else if (top + tooltipRect.height > viewportHeight - 8 + scrollY) {
      top = viewportHeight - tooltipRect.height - 8 + scrollY;
    }

    setTooltipPosition({ top, left });
  };

  // Show tooltip with a delay
  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
      // Wait a moment for the tooltip to render, then calculate position
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  // Hide tooltip
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (visible) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [visible]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animation classes based on position
  const getAnimationClass = () => {
    switch (position) {
      case 'top': return 'animate-tooltip-fade-down';
      case 'bottom': return 'animate-tooltip-fade-up';
      case 'left': return 'animate-tooltip-fade-right';
      case 'right': return 'animate-tooltip-fade-left';
      default: return 'animate-tooltip-fade-down';
    }
  };

  return (
    <div 
      className="inline-block relative"
      ref={targetRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {visible && (
        <div 
          ref={tooltipRef}
          className={`fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-800 rounded shadow-lg max-w-xs break-words ${getAnimationClass()} ${className}`}
          style={{ 
            top: `${tooltipPosition.top}px`, 
            left: `${tooltipPosition.left}px`,
          }}
          role="tooltip"
        >
          {content}
          <div 
            className={`tooltip-arrow absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45 ${
              position === 'top' ? 'bottom-[-4px]' : 
              position === 'bottom' ? 'top-[-4px]' : 
              position === 'left' ? 'right-[-4px]' : 
              'left-[-4px]'
            }`}
            style={{
              left: position === 'top' || position === 'bottom' ? 'calc(50% - 4px)' : undefined,
              top: position === 'left' || position === 'right' ? 'calc(50% - 4px)' : undefined,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 