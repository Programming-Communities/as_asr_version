'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, Users, FileText, Eye, TrendingUp, 
  Calendar, Download, Filter, RefreshCw, Settings 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalUsers: 0,
    totalComments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalPosts: 1247,
        totalViews: 45890,
        totalUsers: 3245,
        totalComments: 8921,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-green-500',
      change: '+24%',
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+8%',
    },
    {
      title: 'Comments',
      value: stats.totalComments,
      icon: FileText,
      color: 'bg-orange-500',
      change: '+18%',
    },
  ];

  const recentPosts = [
    { id: 1, title: 'Understanding Quranic Verses', views: 2450, date: '2024-01-15', status: 'Published' },
    { id: 2, title: 'Hadith Collection Vol. 1', views: 1890, date: '2024-01-14', status: 'Published' },
    { id: 3, title: 'Fiqh for Beginners', views: 3120, date: '2024-01-13', status: 'Published' },
    { id: 4, title: 'Islamic History Timeline', views: 1560, date: '2024-01-12', status: 'Draft' },
    { id: 5, title: 'Salah Guide', views: 2780, date: '2024-01-11', status: 'Published' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back! Here's what's happening with your site.
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button className="btn btn-outline flex items-center space-x-2">
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
              <button className="btn btn-primary flex items-center space-x-2">
                <Download size={16} />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {loading ? '...' : stat.value}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                    <Icon className={stat.color.replace('bg-', 'text-')} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Posts
                  </h2>
                  <button className="btn btn-outline btn-sm flex items-center space-x-2">
                    <Filter size={14} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 px-6">Title</th>
                      <th className="pb-3 px-6">Views</th>
                      <th className="pb-3 px-6">Date</th>
                      <th className="pb-3 px-6">Status</th>
                      <th className="pb-3 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPosts.map((post) => (
                      <tr key={post.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Eye size={14} className="text-gray-400" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                          {post.date}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            post.status === 'Published'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full btn btn-outline">
                  View All Posts
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Traffic Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Traffic Overview
                </h3>
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Today</span>
                    <span className="font-medium text-gray-900 dark:text-white">1,240</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Yesterday</span>
                    <span className="font-medium text-gray-900 dark:text-white">980</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Last Week</span>
                    <span className="font-medium text-gray-900 dark:text-white">8,560</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full btn btn-outline flex items-center justify-between">
                  <span>New Post</span>
                  <FileText size={16} />
                </button>
                <button className="w-full btn btn-outline flex items-center justify-between">
                  <span>Manage Users</span>
                  <Users size={16} />
                </button>
                <button className="w-full btn btn-outline flex items-center justify-between">
                  <span>View Analytics</span>
                  <BarChart3 size={16} />
                </button>
                <button className="w-full btn btn-outline flex items-center justify-between">
                  <span>Site Settings</span>
                  <Settings size={16} />
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">WordPress API</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cache</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs">
                    Enabled
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    99.9%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}