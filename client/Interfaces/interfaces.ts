export interface Artist {
  icon: string;
  name: string;
}
export interface Profile {
  age: number;
  artists: Artist[];
  distance: number;
  gender: string;
  height: string;
  images: string[];
  location: { city: string; latitude: number; longitude: number };
  name: string;
  race: string;
}

export interface ProfileCardProps {
  profileId: string;
}

export interface Match {
  _id: string;
}

export interface ExternalUrls {
  spotify: string;
}
export interface Image {
  url: string;
  height?: number;
  width?: number;
}

export interface TrackArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

// Playlist-Specific Interfaces

interface Owner {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface TracksSummary {
  href: string;
  total: number;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: TracksSummary;
  type: string;
  uri: string;
}

// Song-Specific Interfaces

interface AddedBy {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface Album {
  album_type: string;
  artists: TrackArtist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface ExternalIds {
  isrc?: string;
}

interface Track {
  album: Album;
  artists: TrackArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

interface VideoThumbnail {
  url: string | null;
}

export interface Song {
  added_at: string;
  added_by: AddedBy;
  is_local: boolean;
  primary_color: string | null;
  track: Track;
  video_thumbnail: VideoThumbnail;
}
export interface SelectedPlaylists {
  playlistName: string;
  playlistRef: string;
  playlistImage: string;
}

export interface SelectedTracks {
  songName: string;
  artistName: string[];
  albumImage: string;
}
