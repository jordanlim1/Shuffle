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
  profileId: string
}
