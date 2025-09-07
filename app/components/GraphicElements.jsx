import React from "react";

const GraphicElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Decorative lines */}
      <svg
        className="absolute top-0 right-0 w-96 h-96 opacity-10"
        viewBox="0 0 200 200"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M10,50 Q50,10 100,50 T190,50"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
        />
        <path
          d="M10,100 Q50,60 100,100 T190,100"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <path
          d="M10,150 Q50,110 100,150 T190,150"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </svg>

      {/* Abstract shapes */}
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <polygon
            points="100,10 40,180 190,78 10,78 160,180"
            fill="url(#starGradient)"
            className="animate-spin"
            style={{ animationDuration: "20s" }}
          />
          <defs>
            <linearGradient id="starGradient">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default GraphicElements;
