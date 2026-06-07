'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface ProjectDetail {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  year: number | null;
}

interface ProjectImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  position_in_gallery: number;
}

interface Comment {
  id: string;
  name: string;
  text: string;
  created_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentForm, setCommentForm] = useState({ name: '', text: '' });

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  async function loadProjectData() {
    try {
      const supabase = createClient();
      // Load project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, title, description, category, location, year')
        .eq('id', projectId)
        .eq('is_public', true)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Load images
      const { data: imagesData, error: imagesError } = await supabase
        .from('images')
        .select('id, title, description, image_url, position_in_gallery')
        .eq('project_id', projectId)
        .order('position_in_gallery', { ascending: true });

      if (imagesError) throw imagesError;
      setImages(imagesData || []);

      // Load comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('id, name, text, created_at')
        .in('image_id', (imagesData || []).map(img => img.id))
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmittingComment(true);

    try {
      if (!commentForm.name || !commentForm.text) {
        toast.error('Please fill in all fields');
        return;
      }

      if (images.length === 0) {
        toast.error('No images in this project');
        return;
      }

      const supabase = createClient();
      const { error } = await supabase
        .from('comments')
        .insert({
          image_id: images[0].id,
          name: commentForm.name,
          text: commentForm.text,
        });

      if (error) throw error;
      toast.success('Comment added successfully');
      setCommentForm({ name: '', text: '' });
      loadProjectData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add comment';
      toast.error(message);
    } finally {
      setIsSubmittingComment(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-400">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">Project not found</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-block">
            ← Back to Gallery
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{project.title}</h1>
        </div>
      </header>

      {/* Project Info */}
      <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {project.description && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Description</h2>
                  <p className="text-slate-700 dark:text-slate-300">{project.description}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {project.category && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Category</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{project.category}</p>
                </div>
              )}
              {project.location && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Location</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{project.location}</p>
                </div>
              )}
              {project.year && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Year</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{project.year}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {images.length === 0 ? (
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">
            <p>No images available for this project</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Project Gallery</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="group">
                  <div className="relative h-64 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden mb-3">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{image.title}</h3>
                  {image.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{image.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Comments Section */}
      <section className="bg-slate-50 dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Community Feedback</h2>

          {/* Comment Form */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Leave a Comment</h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Your Feedback
                </label>
                <textarea
                  required
                  value={commentForm.text}
                  onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                  placeholder="Share your thoughts about this project..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white dark:bg-slate-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{comment.name}</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
