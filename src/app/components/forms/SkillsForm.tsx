import { useState, useEffect } from 'react'; // ✅ add useEffect
import { useResume } from '../../context/ResumeContext';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function SkillsForm() {
  const { currentResume, updateSkills } = useResume();
  const [skillInput, setSkillInput] = useState('');
  const [bulkInput, setBulkInput] = useState(''); // ✅ add this

  // ✅ ADD THIS - syncs when AI fills skills
  useEffect(() => {
    if (currentResume?.skills?.length) {
      setBulkInput(currentResume.skills.join(', '));
    }
  }, [currentResume?.skills]);

  if (!currentResume) return null;

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const newSkills = [...currentResume.skills, skillInput.trim()];
    updateSkills(newSkills);
    setSkillInput('');
    toast.success('Skill added!');
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = currentResume.skills.filter((_, i) => i !== index);
    updateSkills(newSkills);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleBulkAdd = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setBulkInput(text); // ✅ update local state
    if (text.includes(',')) {
      const skills = text.split(',').map(s => s.trim()).filter(s => s);
      if (skills.length > 0) {
        updateSkills([...new Set([...currentResume.skills, ...skills])]);
        toast.success(`Added ${skills.length} skills!`);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Skills</h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Add Skills</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a skill and press Enter"
            className="flex-1 px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button onClick={handleAddSkill}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">Press Enter or click Add to add each skill</p>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Or Add Multiple Skills at Once</label>
        <textarea
          value={bulkInput} // ✅ controlled input now
          onChange={handleBulkAdd}
          placeholder="JavaScript, React, Node.js, Python, AWS, Docker (separate with commas)"
          rows={3}
          className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
        />
        <p className="text-sm text-gray-600 mt-2">
          Enter multiple skills separated by commas - they'll be added automatically
        </p>
      </div>

      {currentResume.skills.length > 0 ? (
        <div>
          <h3 className="font-bold mb-3">Your Skills ({currentResume.skills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {currentResume.skills.map((skill, index) => (
              <div key={index}
                className="px-4 py-2 border border-black bg-white flex items-center gap-2 group hover:border-red-600">
                <span>{skill}</span>
                <button onClick={() => handleRemoveSkill(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4 hover:text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-gray-400 p-8 text-center">
          <p className="text-gray-700">No skills added yet. Start adding your technical and professional skills above.</p>
        </div>
      )}

      <div className="mt-8 p-6 border border-black bg-gray-50">
        <h3 className="font-bold mb-3">Tips for Adding Skills</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Include both technical skills (programming languages, tools) and soft skills</li>
          <li>• List skills relevant to the job you're applying for</li>
          <li>• Use industry-standard terminology for better ATS matching</li>
          <li>• Order skills from most to least proficient or most to least relevant</li>
          <li>• Aim for 10-20 skills to keep your resume focused</li>
        </ul>
      </div>
    </div>
  );
}