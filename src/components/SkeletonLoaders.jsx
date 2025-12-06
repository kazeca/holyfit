import React from 'react';

/**
 * Skeleton Loader Components
 * Reusable loading placeholders for better UX
 */

// Card Skeleton
export const CardSkeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl ${className}`}>
        <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        </div>
    </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
    <div className="animate-pulse bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
    </div>
);

// Badge Skeleton
export const BadgeSkeleton = () => (
    <div className="animate-pulse flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-100 dark:bg-gray-800">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mb-2"></div>
        <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
);

// List Item Skeleton
export const ListItemSkeleton = () => (
    <div className="animate-pulse flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
    </div>
);

// Leaderboard Item Skeleton
export const LeaderboardItemSkeleton = () => (
    <div className="animate-pulse flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
);

// Profile Header Skeleton
export const ProfileHeaderSkeleton = () => (
    <div className="animate-pulse flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
    </div>
);

// Dashboard Grid Skeleton
export const DashboardGridSkeleton = () => (
    <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} className="aspect-square" />
        ))}
    </div>
);

// Full Page Skeleton
export const PageSkeleton = ({ title = "Carregando..." }) => (
    <div className="min-h-screen pb-24 pt-6 px-4">
        <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </div>
    </div>
);

// Spinner (for inline loading)
export const Spinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`${sizeClasses[size]} ${className}`}>
            <div className="animate-spin rounded-full border-b-2 border-current w-full h-full"></div>
        </div>
    );
};

// Loading Overlay (for full page loading)
export const LoadingOverlay = ({ message = "Carregando..." }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 flex flex-col items-center gap-4">
            <Spinner size="lg" className="text-purple-500" />
            <p className="text-gray-900 dark:text-white font-bold">{message}</p>
        </div>
    </div>
);

export default {
    CardSkeleton,
    StatsCardSkeleton,
    BadgeSkeleton,
    ListItemSkeleton,
    LeaderboardItemSkeleton,
    ProfileHeaderSkeleton,
    DashboardGridSkeleton,
    PageSkeleton,
    Spinner,
    LoadingOverlay
};
