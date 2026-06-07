'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  is_public: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);
      loadProjects(user.id);
    };

    checkAuth();
  }, []);

  async function loadProjects(userId: string) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, description, category, is_public, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  }

  async function deleteProject(projectId: string) {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      toast.success('Project deleted');
      if (user) loadProjects(user.id);
    } catch (error) {
      toast.error('Failed to delete project');
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📐</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AzGallery Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your Projects</h2>
          <button
            onClick={() => setShowNewProjectForm(!showNewProjectForm)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            {showNewProjectForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {/* New Project Form */}
        {showNewProjectForm && (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Create New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="e.g., Modern Office Building"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Project description..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    placeholder="e.g., Commercial"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    placeholder="e.g., New York, USA"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowNewProjectForm(false)}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        )}

        {/* Projects List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">No projects yet</p>
            <button
              onClick={() => setShowNewProjectForm(true)}
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/admin/project/${project.id}`}>
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-1">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.is_public
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {project.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex gap-4">
                      {project.category && <span>📂 {project.category}</span>}
                      <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteProject(project.id);
                      }}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
