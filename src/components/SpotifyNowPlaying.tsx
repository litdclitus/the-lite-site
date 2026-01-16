'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import useSWR from 'swr'
import type { SpotifyApiResponse } from '../../types/spotify'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SpotifyNowPlaying() {
  const { data, error, isLoading } = useSWR<SpotifyApiResponse>(
    '/api/spotify',
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-[320px] overflow-hidden rounded-xl border border-zinc-100 bg-white/90 backdrop-blur-sm dark:border-zinc-700/40 dark:bg-zinc-800/90"
    >
      <div className="px-2 py-0.5">
        {/* Loading State */}
        {isLoading ? (
          <>
            {/* Status Line with Logo */}
            <div className="mb-0.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 dark:bg-zinc-500" />
                <div className="h-2.5 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
              <div className="h-5 w-5 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
            </div>
            {/* Content Line */}
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex-1">
                <div className="mb-1 h-3 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-2.5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </div>
          </>
        ) : error || data?.error ? (
          <>
            {/* Status Line with Logo */}
            <div className="mb-0.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                <span
                  className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                  style={{
                    fontFamily: 'var(--font-raleway), Raleway, sans-serif',
                  }}
                >
                  Offline
                </span>
              </div>
              <div className="shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-zinc-400 opacity-50 dark:text-zinc-500"
                >
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            {/* Content Line */}
            <div className="flex-1">
              <h4
                className="truncate text-sm font-bold text-zinc-600 dark:text-zinc-400"
                style={{
                  fontFamily: 'var(--font-raleway), Raleway, sans-serif',
                }}
              >
                Unable to connect
              </h4>
              <p
                className="truncate text-xs text-zinc-500 dark:text-zinc-400"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {data?.message || 'Cannot fetch Spotify data'}
              </p>
            </div>
          </>
        ) : data?.title ? (
          <>
            {/* Status Line with Logo */}
            <div className="mb-0.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {data.isPlaying ? (
                  <>
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1DB954]" />
                    <span
                      className="text-[10px] font-semibold tracking-wide text-[#8ac4d0] uppercase"
                      style={{
                        fontFamily: 'var(--font-raleway), Raleway, sans-serif',
                      }}
                    >
                      Now Playing
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                    <span
                      className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                      style={{
                        fontFamily: 'var(--font-raleway), Raleway, sans-serif',
                      }}
                    >
                      Last Played
                    </span>
                  </>
                )}
              </div>
              {/* Spotify Logo */}
              <div className="shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#1DB954] opacity-80"
                >
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* Content Line: Album + Track Info */}
            <div className="flex items-center gap-2.5">
              {/* Album Art */}
              <a
                href={data.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/art relative shrink-0"
              >
                <Image
                  src={data.albumImageUrl || '/placeholder-album.png'}
                  alt={data.album || 'Album art'}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-lg shadow-lg transition-transform group-hover/art:scale-105"
                  unoptimized
                />
              </a>

              {/* Track Info with Progress */}
              <div className="min-w-0 flex-1">
                <a
                  href={data.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/track block"
                >
                  <h4
                    className="truncate text-sm font-bold text-zinc-800 transition-colors group-hover/track:text-teal-600 dark:text-zinc-100 dark:group-hover/track:text-[#8ac4d0]"
                    style={{
                      fontFamily: 'var(--font-raleway), Raleway, sans-serif',
                    }}
                  >
                    {data.title}
                  </h4>
                  <p
                    className="truncate text-xs text-zinc-600 dark:text-zinc-300"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  >
                    {data.artist}
                  </p>

                  {/* Progress Bar */}
                  {data.isPlaying && data.progress_ms && data.duration_ms && (
                    <div className="mt-0.5 w-full">
                      <div className="h-0.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-teal-500 to-teal-600 transition-all duration-1000 dark:from-[#8ac4d0] dark:to-[#1DB954]"
                          style={{
                            width: `${
                              (data.progress_ms / data.duration_ms) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Status Line with Logo */}
            <div className="mb-0.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                <span
                  className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                  style={{
                    fontFamily: 'var(--font-raleway), Raleway, sans-serif',
                  }}
                >
                  Idle
                </span>
              </div>
              <div className="shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#1DB954] opacity-80"
                >
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            {/* Content Line */}
            <div className="flex-1">
              <h4
                className="truncate text-sm font-bold text-zinc-600 dark:text-zinc-400"
                style={{
                  fontFamily: 'var(--font-raleway), Raleway, sans-serif',
                }}
              >
                Not playing anything
              </h4>
              <p
                className="truncate text-xs text-zinc-500 dark:text-zinc-400"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                Waiting for the next track...
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
