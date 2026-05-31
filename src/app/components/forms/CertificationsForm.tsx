import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Plus, Trash2, Check } from 'lucide-react';
import { Certification } from '../../types/resume';
import { toast } from 'sonner';

export default function CertificationsForm() {
  const { currentResume, addCertification, deleteCertification } = useResume();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Certification>({ id: '', name: '', issuer: '', date: '', credentialId: '' });

  if (!currentResume) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.issuer || !formData.date) { toast.error('Please fill in all required fields'); return; }
    addCertification({ ...formData, id: `cert-${Date.now()}` });
    toast.success('Certification added!');
    resetForm();
  };

  const resetForm = () => { setFormData({ id: '', name: '', issuer: '', date: '', credentialId: '' }); setShowForm(false); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Certifications</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm md:text-base">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Certification</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {currentResume.certifications.map((cert) => (
          <div key={cert.id} className="border border-black p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base md:text-lg">{cert.name}</h3>
                <p className="text-gray-700 text-sm md:text-base">{cert.issuer}</p>
                <p className="text-sm text-gray-600">{cert.date}</p>
                {cert.credentialId && <p className="text-sm text-gray-600">ID: {cert.credentialId}</p>}
              </div>
              <button onClick={() => deleteCertification(cert.id)}
                className="p-2 border border-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-black p-4 md:p-6 space-y-4 md:space-y-6">
          <h3 className="font-bold text-lg">Add New Certification</h3>
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Certification Name <span className="text-red-600">*</span></label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="AWS Certified Solutions Architect" required
              className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
          </div>
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Issuing Organization <span className="text-red-600">*</span></label>
            <input type="text" value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="Amazon Web Services" required
              className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block mb-2 font-medium text-sm md:text-base">Issue Date <span className="text-red-600">*</span></label>
              <input type="month" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
            </div>
            <div>
              <label className="block mb-2 font-medium text-sm md:text-base">Credential ID (Optional)</label>
              <input type="text" value={formData.credentialId || ''} onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                placeholder="ABC123XYZ"
                className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm md:text-base">
              <Check className="w-4 h-4" />Add Certification
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-black hover:bg-gray-100 transition-colors text-sm md:text-base">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-6 md:mt-8 p-4 md:p-6 border border-black bg-gray-50">
        <h3 className="font-bold mb-3 text-sm md:text-base">Common Professional Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-1">Technology:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>AWS Certified Solutions Architect</li>
              <li>Google Cloud Professional</li>
              <li>Microsoft Azure Certified</li>
              <li>CompTIA Security+</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Project Management:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>PMP (Project Management Professional)</li>
              <li>Scrum Master (CSM)</li>
              <li>Six Sigma Certified</li>
              <li>Agile Certified Practitioner</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}