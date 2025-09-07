import React from "react";

function ShimmerCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-48 bg-gray-200" />{" "}
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded w-1/3"></div>{" "}
      </div>{" "}
    </div>
  );
}

export default ShimmerCard;
