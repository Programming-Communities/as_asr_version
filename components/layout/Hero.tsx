'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-12">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles size={16} className="text-white" />
            <span className="text-white text-sm font-medium">
              Islamic Knowledge Hub
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Discover Wisdom from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">
              Authentic Sources
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-white/90 mb-8">
            Explore comprehensive articles, Quranic insights, Hadith explanations, 
            and scholarly research in one unified platform.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for articles, topics, or authors..."
                className="w-full p-4 pl-14 pr-32 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-white/40"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center space-x-2"
              >
                <span>Search</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { label: 'Articles', value: '1,234+' },
              { label: 'Categories', value: '24' },
              { label: 'Authors', value: '48' },
              { label: 'Daily Readers', value: '10K+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-1/4 right-10 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 left-10 w-16 h-16 bg-white/5 rounded-full backdrop-blur-sm"
      />
    </section>
  );
}
