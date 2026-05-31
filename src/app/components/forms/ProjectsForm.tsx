import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Project } from '../../types/resume';
import { toast } from 'sonner';

export default function ProjectsForm() {
  const { currentResume, addProject, updateProject, deleteProject } = useResume();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Project>({
    id: '',
    name: '',
    description: '',
    technologies: [],
    link: '',
    github: ''
  });
  const [techInput, setTechInput] = useState('');

  if (!currentResume) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateProject(editingId, formData);
      toast.success('Project updated!');
    } else {
      addProject({ ...formData, id: `proj-${Date.now()}` });
      toast.success('Project added!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      technologies: [],
      link: '',
      github: ''
    });
    setTechInput('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (proj: Project) => {
    setFormData(proj);
    setTechInput(proj.technologies.join(', '));
    setEditingId(proj.id);
    setShowForm(true);
  };

  const handleTechChange = (value: string) => {
    setTechInput(value);
    const techs = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, technologies: techs });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        )}
      </div>

      {/* Projects List */}
      <div className="space-y-4 mb-8">
        {currentResume.projects.map((proj) => (
          <div key={proj.id} className="border border-black p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{proj.name}</h3>
                <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {proj.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 border border-black text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                {(proj.link || proj.github) && (
                  <div className="mt-2 text-sm">
                    {proj.link && <a href={proj.link} className="hover:underline mr-3">Live Demo</a>}
                    {proj.github && <a href={proj.github} className="hover:underline">GitHub</a>}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(proj)}
                  className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProject(proj.id)}
                  className="p-2 border border-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-black p-6 space-y-6">
          <h3 className="font-bold text-lg">
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h3>

          <div>
            <label className="block mb-2 font-medium">
              Project Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="E-commerce Platform"
              required
              className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Developed a full-stack e-commerce platform with real-time inventory management..."
              rows={4}
              required
              className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Technologies Used</label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => handleTechChange(e.target.value)}
              placeholder="React, Node.js, MongoDB, AWS (separate with commas)"
              className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech, i) => (
                  <span key={i} className="px-2 py-1 bg-black text-white text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">Live Demo URL</label>
              <input
                type="url"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://project-demo.com"
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">GitHub URL</label>
              <input
                type="url"
                value={formData.github || ''}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/username/project"
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <Check className="w-4 h-4" />
              {editingId ? 'Update' : 'Add'} Project
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-black hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
