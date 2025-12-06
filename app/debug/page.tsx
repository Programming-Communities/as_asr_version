'use client';

import { useState, useEffect } from 'react';
import wordpressService from '@/services/wordpress';

export default function DebugPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadPosts() {
      try {
        const result = await wordpressService.fetchPosts({ first: 5 });
        console.log('Posts result:', result);
        setPosts(result.posts);
      } catch (err: any) {
        setError(err.message);
        console.error('Error:', err);
      }
    }
    loadPosts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">WordPress Connection Debug</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Environment Variables:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify({
            wordpressUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
            graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
          }, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Posts ({posts.length}):</h2>
        {posts.length === 0 ? (
          <p>No posts loaded</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border p-4 rounded">
                <h3 className="font-bold">{post.title}</h3>
                <p className="text-sm text-gray-600">ID: {post.id}</p>
                <p className="text-sm text-gray-600">Slug: {post.slug}</p>
                <p className="text-sm text-gray-600">Categories: {post.categories?.length || 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}