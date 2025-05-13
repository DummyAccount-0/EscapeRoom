import React, { useState } from 'react';
import { TeamMember } from '../types';
import { UserPlus, X, Save } from 'lucide-react';

interface TeamRegistrationFormProps {
  onRegister: (teamName: string, members: TeamMember[]) => void;
}

const TeamRegistrationForm: React.FC<TeamRegistrationFormProps> = ({ onRegister }) => {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([{ name: '' }]);
  const [error, setError] = useState('');

  const addMember = () => {
    if (members.length < 4) {
      setMembers([...members, { name: '' }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, name: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { name };
    setMembers(updatedMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }
    
    const validMembers = members.filter(m => m.name.trim() !== '');
    if (validMembers.length === 0) {
      setError('At least one team member is required');
      return;
    }
    
    // Clear error if validation passes
    setError('');
    
    // Submit form
    onRegister(teamName, validMembers);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8 shadow-lg max-w-2xl w-full mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Team Registration</h2>
      
      {error && (
        <div className="mb-6 p-3 bg-red-900/30 border border-red-600/30 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="teamName" className="block text-gray-300 mb-2">
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your team name"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-300">
              Team Members (Max 4)
            </label>
            <button
              type="button"
              onClick={addMember}
              disabled={members.length >= 4}
              className={`flex items-center text-sm px-3 py-1 rounded ${
                members.length >= 4 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <UserPlus size={16} className="mr-1" /> Add Member
            </button>
          </div>
          
          <div className="space-y-3">
            {members.map((member, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(index, e.target.value)}
                  className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Team member ${index + 1}`}
                />
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="p-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-gray-300"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          <Save size={18} className="mr-2" /> Register Team
        </button>
      </form>
    </div>
  );
};

export default TeamRegistrationForm;