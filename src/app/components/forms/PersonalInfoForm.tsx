import { useResume } from '../../context/ResumeContext';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';

export default function PersonalInfoForm() {
  const { currentResume, updatePersonalInfo } = useResume();
  if (!currentResume) return null;
  const { personalInfo } = currentResume;

  const handleChange = (field: string, value: string) => {
    updatePersonalInfo({ ...personalInfo, [field]: value });
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-6">Personal Information</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Full Name <span className="text-red-600">*</span></label>
            <input type="text" value={personalInfo.fullName} onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="John Doe" required
              className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
          </div>
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Email <span className="text-red-600">*</span></label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              <input type="email" value={personalInfo.email} onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john.doe@email.com" required
                className="w-full pl-10 pr-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Phone <span className="text-red-600">*</span></label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              <input type="tel" value={personalInfo.phone} onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567" required
                className="w-full pl-10 pr-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              <input type="text" value={personalInfo.location || ''} onChange={(e) => handleChange('location', e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full pl-10 pr-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6">
          <h3 className="font-bold mb-4 text-sm md:text-base">Online Profiles (Optional)</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-sm md:text-base">LinkedIn URL</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <input type="url" value={personalInfo.linkedIn || ''} onChange={(e) => handleChange('linkedIn', e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                  className="w-full pl-10 pr-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-sm md:text-base">GitHub URL</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <input type="url" value={personalInfo.github || ''} onChange={(e) => handleChange('github', e.target.value)}
                  placeholder="github.com/johndoe"
                  className="w-full pl-10 pr-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-sm md:text-base">Portfolio URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <input type="url" value={personalInfo.portfolio || ''} onChange={(e) => handleChange('portfolio', e.target.value)}
                  placeholder="johndoe.com"
                  className="w-full pl-10 pr-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}