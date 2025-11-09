import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Funda Nathi smiling face logo"
    >
      <defs>
        <filter id="glow-dots">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill="#FFD500" filter="url(#glow-dots)">
        {/* Left Eye */}
        <circle cx="35" cy="40" r="5" />

        {/* Right Eye */}
        <circle cx="65" cy="40" r="5" />

        {/* Smile made of dots */}
        <circle cx="35" cy="65" r="4" />
        <circle cx="50" cy="70" r="4" />
        <circle cx="65" cy="65" r="4" />
      </g>
    </svg>
  );
};

export default Logo;