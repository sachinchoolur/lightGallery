'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  is_public: boolean;
}

interface ProjectImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  position_in_gallery: number;
}

export default function AdminProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', category: '', is_public: false });

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);
      loadProject(user.id);
    };

    checkAuth();
  }, [projectId]);

  async function loadProject(userId: string) {
    try {
      const supabase = createClient();
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, title, description, category, is_public')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);
      setProjectForm(projectData);

      const { data: imagesData, error: imagesError } = await supabase
        .from('images')
        .select('id, title, description, image_url, position_in_gallery')
        .eq('project_id', projectId)
        .order('position_in_gallery', { ascending: true });

      if (imagesError) throw imagesError;
      setImages(imagesData || []);
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
      router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProject() {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('projects')
        .update({
          title: projectForm.title,
          description: projectForm.description,
          category: projectForm.category,
          is_public: projectForm.is_public,
        })
        .eq('id', projectId);

      if (error) throw error;
      toast.success('Project updated');
      setIsEditingProject(false);
      if (user) loadProject(user.id);
    } catch (error) {
      toast.error('Failed to update project');
    }
  }

  async function deleteImage(imageId: string) {
    if (!confirm('Delete this image?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      toast.success('Image deleted');
      if (user) loadProject(user.id);
    } catch (error) {
      toast.error('Failed to delete image');
    }
  }

  if (isLoading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.title}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Project Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Project Settings</h2>
            <button
              onClick={() => setIsEditingProject(!isEditingProject)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isEditingProject ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingProject ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={projectForm.description || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={projectForm.category || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={projectForm.is_public}
                  onChange={(e) => setProjectForm({ ...projectForm, is_public: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="is_public" className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Make this project public
                </label>
              </div>
              <button
                onClick={updateProject}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-slate-700 dark:text-slate-300">
              <p><strong>Title:</strong> {project.title}</p>
              <p><strong>Description:</strong> {project.description || 'No description'}</p>
              <p><strong>Category:</strong> {project.category || 'None'}</p>
              <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                project.is_public
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {project.is_public ? 'Public' : 'Private'}
              </p>
            </div>
          )}
        </div>

        {/* Images Section */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Project Images</h2>

          {images.length === 0 ? (
            <div className="text-center py-12 text-slate-600 dark:text-slate-400">
              <p>No images yet. Use the upload feature to add images.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {images.map((image) => (
                <div key={image.id} className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{image.title}</h3>
                    {image.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">{image.description}</p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Position: {image.position_in_gallery}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
