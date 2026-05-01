export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
}

export interface ItineraryItem {
  id: string;
  title: string;
  time?: string;
  location_name: string;
  coordinates?: [number, number];
  note?: string;
  type: 'activity' | 'transport' | 'lodging' | 'food';
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  start_date: string;
  end_date: string;
  creator_id: string;
  is_public: boolean;
  status: 'planning' | 'ongoing' | 'completed';
  participants: User[];
  coordinates?: [number, number];
  itinerary?: ItineraryItem[];
  cover_url?: string;
}
