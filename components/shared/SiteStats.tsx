'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Folder, Users, Eye } from 'lucide-react';
import wordpressService from '@/services/wordpress';

export default function SiteStats() {
  const [stats, setStats] = useState({
    articles: 1234,
    categories: 24,
    authors: 48,
    dailyReaders: 10000,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statistics = await wordpressService.getSiteStatistics();
        
        setStats({
          articles: statistics.totalPosts || 1234,
          categories: statistics.totalCategories || 24,
          authors: statistics.totalAuthors || 48,
          dailyReaders: statistics.dailyReaders || 10000,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
    
    // Update every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      value: stats.loading ? '...' : `${stats.articles.toLocaleString()}+`,
      label: 'Articles',
      description: 'Total published articles',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: <Folder className="w-6 h-6" />,
      value: stats.loading ? '...' : stats.categories,
      label: 'Categories',
      description: 'Content categories',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: stats.loading ? '...' : stats.authors,
      label: 'Authors',
      description: 'Contributing writers',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      value: stats.loading ? '...' : `${(stats.dailyReaders / 1000).toFixed(1)}K+`,
      label: 'Daily Readers',
      description: 'Estimated daily visitors',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${item.bgColor}`}>
              <div className={item.color}>
                {item.icon}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.label}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}