'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  thumbnail?: string;
}

export default function VideoPlayer({
  videoUrl,
  title,
  className = '',
  autoPlay = false,
  controls = true,
  thumbnail,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Extract video ID for YouTube/Vimeo
  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : url;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    
    return url;
  };

  const embedUrl = getVideoEmbedUrl(videoUrl);

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-2xl overflow-hidden">
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          frameBorder="0"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      
      {!controls && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-transform hover:scale-110"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <Pause className="text-black" size={24} />
            ) : (
              <Play className="text-black ml-1" size={24} />
            )}
          </button>
        </div>
      )}

      {/* Custom controls for non-embed videos */}
      {!embedUrl.includes('youtube.com') && !embedUrl.includes('vimeo.com') && controls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-gray-300"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <div className="flex-1 mx-4">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Volume2 size={18} className="text-white" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-white hover:text-gray-300"
                aria-label="Fullscreen"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}