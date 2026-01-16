/**
 * Spotify API Types
 * Centralized type definitions for Spotify API responses
 */

export interface SpotifyTrack {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string; height: number; width: number }>;
    };
    external_urls: {
      spotify: string;
    };
    duration_ms: number;
  }
  
  export interface SpotifyNowPlayingResponse {
    is_playing: boolean;
    progress_ms?: number;
    item: SpotifyTrack | null;
    currently_playing_type?: string;
  }
  
  export interface SpotifyRecentlyPlayedResponse {
    items: Array<{
      track: SpotifyTrack;
      played_at: string;
    }>;
  }
  
  export interface SpotifyApiResponse {
    isPlaying: boolean;
    title?: string;
    artist?: string;
    album?: string;
    albumImageUrl?: string;
    songUrl?: string;
    progress_ms?: number;
    duration_ms?: number;
    lastPlayed?: string;
    error?: string;
    message?: string;
  }  