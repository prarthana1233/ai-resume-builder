import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Plus, Trash2, Edit2, Check, X, Sparkles } from 'lucide-react';
import { Experience } from '../../types/resume';
import { toast } from 'sonner';

export default function ExperienceForm() {
  const { currentResume, addExperience, updateExperience, deleteExperience } = useResume();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Experience>({
    id: '',
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ['']
  });

  if (!currentResume) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company || !formData.position || !formData.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const experienceData = {
      ...formData,
      description: formData.description.filter(d => d.trim())
    };

    if (editingId) {
      updateExperience(editingId, experienceData);
      toast.success('Experience updated!');
    } else {
      addExperience({ ...experienceData, id: `exp-${Date.now()}` });
      toast.success('Experience added!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (exp: Experience) => {
    setFormData(exp);
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDesc = [...formData.description];
    newDesc[index] = value;
    setFormData({ ...formData, description: newDesc });
  };

  const addDescriptionPoint = () => {
    setFormData({ ...formData, description: [...formData.description, ''] });
  };

  const removeDescriptionPoint = (index: number) => {
    const newDesc = formData.description.filter((_, i) => i !== index);
    setFormData({ ...formData, description: newDesc });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        )}
      </div>

      {/* Experience List */}
      <div className="space-y-4 mb-8">
        {currentResume.experience.map((exp) => (
          <div key={exp.id} className="border border-black p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{exp.position}</h3>
                <p className="text-gray-700">{exp.company} • {exp.location}</p>
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteExperience(exp.id)}
                  className="p-2 border border-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {exp.description.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-black p-6 space-y-6">
          <h3 className="font-bold text-lg">
            {editingId ? 'Edit Experience' : 'Add New Experience'}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">
                Company <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Tech Corp"
                required
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Position <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Software Engineer"
                required
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="San Francisco, CA"
              className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">
                Start Date <span className="text-red-600">*</span>
              </label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                End Date {!formData.current && <span className="text-red-600">*</span>}
              </label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={formData.current}
                required={!formData.current}
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                className="w-4 h-4"
              />
              <span>I currently work here</span>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium">Responsibilities & Achievements</label>
              <button
                type="button"
                onClick={addDescriptionPoint}
                className="text-sm px-3 py-1 border border-black hover:bg-black hover:text-white transition-colors"
              >
                Add Point
              </button>
            </div>
            <div className="space-y-3">
              {formData.description.map((desc, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={desc}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    placeholder="Led development of microservices architecture..."
                    rows={2}
                    className="flex-1 px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {formData.description.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDescriptionPoint(index)}
                      className="p-3 border border-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <Check className="w-4 h-4" />
              {editingId ? 'Update' : 'Add'} Experience
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
