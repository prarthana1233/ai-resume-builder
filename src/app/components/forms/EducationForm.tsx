import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Education } from '../../types/resume';
import { toast } from 'sonner';

export default function EducationForm() {
  const { currentResume, addEducation, updateEducation, deleteEducation } = useResume();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Education>({
    id: '', institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: ''
  });

  if (!currentResume) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution || !formData.degree || !formData.field) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (editingId) { updateEducation(editingId, formData); toast.success('Education updated!'); }
    else { addEducation({ ...formData, id: `edu-${Date.now()}` }); toast.success('Education added!'); }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ id: '', institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (edu: Education) => { setFormData(edu); setEditingId(edu.id); setShowForm(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Education</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm md:text-base">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Education</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {currentResume.education.map((edu) => (
          <div key={edu.id} className="border border-black p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base md:text-lg">{edu.degree} in {edu.field}</h3>
                <p className="text-gray-700 text-sm md:text-base">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}{edu.gpa && ` • GPA: ${edu.gpa}`}</p>
                {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(edu)} className="p-2 border border-black hover:bg-black hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteEducation(edu.id)} className="p-2 border border-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-black p-4 md:p-6 space-y-4 md:space-y-6">
          <h3 className="font-bold text-lg">{editingId ? 'Edit Education' : 'Add New Education'}</h3>
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Institution <span className="text-red-600">*</span></label>
            <input type="text" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="Stanford University" required
              className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block mb-2 font-medium text-sm md:text-base">Degree <span className="text-red-600">*</span></label>
              <input type="text" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Bachelor of Science" required
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
            </div>
            <div>
              <label className="block mb-2 font-medium text-sm md:text-base">Field of Study <span className="text-red-600">*</span></label>
              <input type="text" value={formData.field} onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                placeholder="Computer Science" required
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block mb-2 font-medium text-sm md:text-base">Start Date</label>
              <input type="month" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
            </div>
            <div>
              <label className="block mb-2 font-medium text-sm md:text-base">End Date</label>
              <input type="month" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Description (Optional)</label>
            <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Relevant coursework, honors, awards..." rows={3}
              className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm md:text-base">
              <Check className="w-4 h-4" />{editingId ? 'Update' : 'Add'} Education
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-black hover:bg-gray-100 transition-colors text-sm md:text-base">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}