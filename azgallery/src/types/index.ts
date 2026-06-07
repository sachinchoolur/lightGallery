// Database types
export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  year: number | null;
  cover_image_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  image_url: string;
  storage_path: string | null;
  position_in_gallery: number;
  created_at: string;
}

export interface Comment {
  id: string;
  image_id: string;
  name: string;
  phone: string | null;
  text: string;
  created_at: string;
}

export interface Annotation {
  id: string;
  image_id: string;
  user_id: string;
  x_ratio: number;
  y_ratio: number;
  title: string | null;
  description: string | null;
  annotation_number: number | null;
  created_at: string;
}

export interface AccessToken {
  id: string;
  project_id: string;
  user_id: string;
  token_hash: string;
  expires_at: string | null;
  max_uses: number | null;
  use_count: number;
  created_at: string;
}
