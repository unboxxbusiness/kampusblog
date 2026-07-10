import React from "react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-3 w-3 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-3 w-3 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6"></div>

      {/* Metadata Row Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>

      {/* Main Content Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (Article Content) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
