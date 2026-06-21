import React from 'react';

export default function PartnerMatchLogo({ size = 32, className = '', isWhite = false }: { size?: number; className?: string; isWhite?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left Blue Diamond */}
      <polygon
        points="120,500 423,197 726,500 423,803"
        fill={isWhite ? "#ffffff" : "#2B5AC6"}
        opacity={isWhite ? 0.9 : 1}
      />
      {/* Right Orange Diamond */}
      <polygon
        points="274,500 577,197 880,500 577,803"
        fill={isWhite ? "#ffffff" : "#F48B05"}
        opacity={isWhite ? 0.75 : 1}
      />
      {/* Overlap Diamond */}
      <polygon
        points="274,500 500,274 726,500 500,726"
        fill={isWhite ? "#ffffff" : "#8E7364"}
        opacity={isWhite ? 0.5 : 1}
      />
    </svg>
  );
}
