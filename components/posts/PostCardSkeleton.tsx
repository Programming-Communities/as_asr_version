import { useDeviceType } from '@/hooks/useDeviceType';

export default function PostCardSkeleton() {
  const device = useDeviceType();

  if (device === 'desktop') {
    return (
      <div className="card overflow-hidden animate-pulse">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 aspect-video md:aspect-square bg-gray-200 dark:bg-gray-800" />
          <div className="md:w-3/5 p-6 space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (device === 'tablet') {
    return (
      <div className="card animate-pulse">
        <div className="aspect-video bg-gray-200 dark:bg-gray-800" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12" />
          </div>
        </div>
      </div>
    );
  }

  // Mobile
  return (
    <div className="flex items-start space-x-3 p-3 animate-pulse">
      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="flex space-x-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-10" />
        </div>
      </div>
    </div>
  );
}
