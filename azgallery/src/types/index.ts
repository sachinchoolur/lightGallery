import type { Database } from './types/database';

export type Project = Database['public']['Tables']['projects']['Row'];
export type Image = Database['public']['Tables']['images']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Annotation = Database['public']['Tables']['annotations']['Row'];
export type AccessToken = Database['public']['Tables']['access_tokens']['Row'];
