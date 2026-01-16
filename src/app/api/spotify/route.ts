import { NextResponse } from "next/server";
import type {
  SpotifyNowPlayingResponse,
  SpotifyRecentlyPlayedResponse,
} from "../../../../types/spotify";

const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

/**
 * Fetches currently playing track from Spotify
 */
async function getNowPlaying(
  accessToken: string
): Promise<SpotifyNowPlayingResponse | null> {
  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // 204 = No content (nothing is currently playing)
  if (response.status === 204 || response.status === 202) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to get now playing");
  }

  const data: SpotifyNowPlayingResponse = await response.json();
  return data;
}

/**
 * Fetches recently played tracks from Spotify
 */
async function getRecentlyPlayed(
  accessToken: string
): Promise<SpotifyRecentlyPlayedResponse> {
  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get recently played");
  }

  const data: SpotifyRecentlyPlayedResponse = await response.json();
  return data;
}

/**
 * Refreshes Spotify access token using refresh token from environment
 */
async function refreshAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify credentials in environment variables");
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * API Route: GET /api/spotify
 * Returns currently playing or recently played track from owner's Spotify
 */
export async function GET() {
  try {
    const accessToken = await refreshAccessToken();
    const nowPlaying = await getNowPlaying(accessToken);

    // Return now playing track (only music, not podcasts)
    if (
      nowPlaying &&
      nowPlaying.item &&
      nowPlaying.currently_playing_type === "track"
    ) {
      return NextResponse.json({
        isPlaying: nowPlaying.is_playing,
        title: nowPlaying.item.name,
        artist: nowPlaying.item.artists.map((a) => a.name).join(", "),
        album: nowPlaying.item.album.name,
        albumImageUrl: nowPlaying.item.album.images[0]?.url || "",
        songUrl: nowPlaying.item.external_urls.spotify,
        progress_ms: nowPlaying.progress_ms,
        duration_ms: nowPlaying.item.duration_ms,
      });
    }

    // Fallback to recently played track
    const recentlyPlayed = await getRecentlyPlayed(accessToken);

    if (
      recentlyPlayed &&
      recentlyPlayed.items &&
      recentlyPlayed.items.length > 0
    ) {
      const lastTrack = recentlyPlayed.items[0].track;
      return NextResponse.json({
        isPlaying: false,
        title: lastTrack.name,
        artist: lastTrack.artists.map((a) => a.name).join(", "),
        album: lastTrack.album.name,
        albumImageUrl: lastTrack.album.images[0]?.url || "",
        songUrl: lastTrack.external_urls.spotify,
        lastPlayed: recentlyPlayed.items[0].played_at,
      });
    }

    return NextResponse.json({
      isPlaying: false,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch Spotify data",
        message: error instanceof Error ? error.message : "Unknown error",
        isPlaying: false,
      },
      { status: 500 }
    );
  }
}

export const revalidate = 10;