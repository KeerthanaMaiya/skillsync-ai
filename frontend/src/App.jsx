import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [userSkills, setUserSkills] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [gapResult, setGapResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Common skills for user to select
  const commonSkills = [
    'JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Python', 
    'Java', 'MongoDB', 'SQL', 'Git', 'Docker', 'AWS', 'TypeScript'
  ];

  const analyzeJob = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/analysis/analyze-job`, {
        jobDescription
      });
      
      setAnalysis(response.data);
      setGapResult(null);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze job description');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSkill = (skill) => {
    setUserSkills(prev => {
      const exists = prev.find(s => s.name === skill);
      if (exists) {
        return prev.filter(s => s.name !== skill);
      } else {
        return [...prev, { name: skill, level: 'Intermediate' }];
      }
    });
  };

  const analyzeGap = async () => {
    if (!analysis || userSkills.length === 0) {
      alert('Please analyze a job and select your skills first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/analysis/analyze-gap`, {
        requiredSkills: analysis.requiredSkills,
        userSkills
      });
      
      setGapResult(response.data);
    } catch (error) {
      console.error('Gap analysis error:', error);
      alert('Failed to analyze skill gap');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setJobDescription('');
    setUserSkills([]);
    setAnalysis(null);
    setGapResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">SkillSync</h1>
          <p className="text-xl text-gray-600">AI-Powered Skills Gap Analyzer</p>
          <p className="text-gray-500 mt-2">Upload a job description and discover what skills you need to land your dream job</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Job Description Input */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Step 1: Analyze Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here...
Example: 'We are looking for a React developer with Node.js experience. Knowledge of MongoDB and AWS is a plus. Must have strong JavaScript skills.'"
                className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={analyzeJob}
                disabled={loading}
                className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Analyzing...' : 'Analyze Job Requirements'}
              </button>
            </div>

            {/* User Skills Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Step 2: Select Your Skills</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {commonSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleUserSkill(skill)}
                    className={`p-3 rounded-lg border-2 text-center ${
                      userSkills.find(s => s.name === skill)
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Your selected skills: {userSkills.length}</p>
                <div className="flex flex-wrap gap-2">
                  {userSkills.map(skill => (
                    <span key={skill.name} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={analyzeGap}
                disabled={!analysis || userSkills.length === 0 || loading}
                className="mt-4 w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Analyzing Gap...' : 'Analyze Skill Gap'}
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Analysis Results */}
            {analysis && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Job Requirements</h2>
                <div className="mb-4">
                  <p className="text-lg font-medium text-gray-700">
                    Found {analysis.totalSkills} required skills:
                  </p>
                </div>
                
                {Object.entries(analysis.categories).map(([category, skills]) => (
                  <div key={category} className="mb-4">
                    <h3 className="font-semibold text-lg text-blue-700 mb-2">{category}</h3>
                    <div className="grid gap-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Gap Analysis Results */}
            {gapResult && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Your Skill Gap Analysis</h2>
                
                {/* Match Percentage */}
                <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <div className="text-5xl font-bold text-blue-700 mb-2">
                    {gapResult.matchPercentage}%
                  </div>
                  <p className="text-gray-600">Overall Skill Match</p>
                </div>

                {/* Matched Skills */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-green-700 mb-3">
                    ✅ Skills You Have ({gapResult.totalMatched})
                  </h3>
                  <div className="grid gap-2">
                    {gapResult.matchedSkills.map((skill, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="font-medium text-green-800">{skill.name}</div>
                        <div className="text-sm text-green-600">Your level: {skill.userLevel}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <h3 className="font-semibold text-lg text-red-700 mb-3">
                    📚 Skills to Learn ({gapResult.totalMissing})
                  </h3>
                  <div className="grid gap-3">
                    {gapResult.missingSkills.map((skill, index) => (
                      <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="font-medium text-red-800 mb-2">{skill.name}</div>
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Category:</strong> {skill.category} | 
                          <strong> Level:</strong> {skill.level}
                        </div>
                        <div className="text-sm">
                          <strong>Learn from:</strong>
                          <ul className="list-disc list-inside mt-1 text-blue-600">
                            {skill.resources.map((resource, idx) => (
                              <li key={idx}>
                                <a href="#" className="hover:underline" onClick={(e) => {
                                  e.preventDefault();
                                  alert(`Would normally open: ${resource}`);
                                }}>
                                  {resource}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reset Button */}
        {(analysis || gapResult) && (
          <div className="text-center mt-8">
            <button
              onClick={resetAll}
              className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;