const express = require('express');
const router = express.Router();

// Enhanced skills database
const SKILLS_DATABASE = {
  // Frontend Technologies
  'JavaScript': { category: 'Frontend', level: 'Intermediate', resources: ['MDN JavaScript Guide', 'JavaScript.info', 'FreeCodeCamp JavaScript'] },
  'React': { category: 'Frontend', level: 'Intermediate', resources: ['React Official Docs', 'Epic React', 'React Tutorial'] },
  'HTML': { category: 'Frontend', level: 'Beginner', resources: ['MDN HTML', 'HTML.com Tutorials'] },
  'CSS': { category: 'Frontend', level: 'Beginner', resources: ['MDN CSS', 'CSS-Tricks', 'FreeCodeCamp CSS'] },
  'TypeScript': { category: 'Frontend', level: 'Intermediate', resources: ['TypeScript Docs', 'TypeScript Deep Dive'] },
  'Vue': { category: 'Frontend', level: 'Intermediate', resources: ['Vue.js Guide', 'Vue Mastery'] },
  'Angular': { category: 'Frontend', level: 'Advanced', resources: ['Angular Docs', 'Angular University'] },
  
  // Backend Technologies
  'Node.js': { category: 'Backend', level: 'Intermediate', resources: ['Node.js Docs', 'The Net Ninja Node.js'] },
  'Python': { category: 'Backend', level: 'Intermediate', resources: ['Python Official Docs', 'Real Python', 'Automate the Boring Stuff'] },
  'Java': { category: 'Backend', level: 'Advanced', resources: ['Java Official Docs', 'Java Tutorials Point'] },
  'Express': { category: 'Backend', level: 'Intermediate', resources: ['Express.js Guide', 'Express.js Documentation'] },
  'Django': { category: 'Backend', level: 'Advanced', resources: ['Django Docs', 'Django for Beginners'] },
  'Spring Boot': { category: 'Backend', level: 'Advanced', resources: ['Spring Boot Guide', 'Baeldung Spring'] },
  
  // Databases
  'MongoDB': { category: 'Database', level: 'Intermediate', resources: ['MongoDB University', 'MongoDB Docs'] },
  'PostgreSQL': { category: 'Database', level: 'Intermediate', resources: ['PostgreSQL Tutorial', 'PostgreSQL Exercises'] },
  'MySQL': { category: 'Database', level: 'Intermediate', resources: ['MySQL Tutorial', 'MySQL for Beginners'] },
  'SQL': { category: 'Database', level: 'Intermediate', resources: ['SQLZoo', 'SQL Bolt', 'W3Schools SQL'] },
  
  // DevOps & Tools
  'Git': { category: 'Tools', level: 'Beginner', resources: ['Git Handbook', 'Atlassian Git Tutorials'] },
  'Docker': { category: 'DevOps', level: 'Intermediate', resources: ['Docker Getting Started', 'Docker Curriculum'] },
  'AWS': { category: 'DevOps', level: 'Advanced', resources: ['AWS Training', 'AWS Docs'] },
  'REST API': { category: 'Backend', level: 'Intermediate', resources: ['REST API Tutorial', 'MDN REST'] },
  
  // Soft Skills
  'Agile': { category: 'Methodology', level: 'Beginner', resources: ['Agile Manifesto', 'Atlassian Agile'] },
  'Scrum': { category: 'Methodology', level: 'Beginner', resources: ['Scrum Guide', 'Scrum.org'] }
};

// Analyze job description
router.post('/analyze-job', (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const extractedSkills = extractSkillsFromText(jobDescription);
    
    res.json({
      success: true,
      requiredSkills: extractedSkills,
      totalSkills: extractedSkills.length,
      categories: categorizeSkills(extractedSkills)
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

// Analyze skill gap
router.post('/analyze-gap', (req, res) => {
  try {
    const { requiredSkills, userSkills } = req.body;
    
    const gapAnalysis = analyzeSkillGap(requiredSkills, userSkills);
    
    res.json({
      success: true,
      ...gapAnalysis
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Gap analysis failed', details: error.message });
  }
});

// Skill extraction function
function extractSkillsFromText(text) {
  const skills = [];
  const textLower = text.toLowerCase();
  
  // Check for each skill in the database
  Object.keys(SKILLS_DATABASE).forEach(skill => {
    const skillLower = skill.toLowerCase();
    
    // Simple keyword matching
    if (textLower.includes(skillLower)) {
      skills.push({
        name: skill,
        category: SKILLS_DATABASE[skill].category,
        level: SKILLS_DATABASE[skill].level,
        resources: SKILLS_DATABASE[skill].resources
      });
    }
  });
  
  return skills;
}

// Categorize skills
function categorizeSkills(skills) {
  const categories = {};
  
  skills.forEach(skill => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });
  
  return categories;
}

// Analyze skill gap
function analyzeSkillGap(requiredSkills, userSkills) {
  const userSkillNames = userSkills.map(skill => skill.name);
  
  const matchedSkills = [];
  const missingSkills = [];
  
  requiredSkills.forEach(reqSkill => {
    if (userSkillNames.includes(reqSkill.name)) {
      const userSkill = userSkills.find(s => s.name === reqSkill.name);
      matchedSkills.push({
        ...reqSkill,
        userLevel: userSkill.level,
        match: 'strong'
      });
    } else {
      missingSkills.push({
        ...reqSkill,
        match: 'missing'
      });
    }
  });
  
  const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);
  
  return {
    matchedSkills,
    missingSkills,
    matchPercentage,
    totalRequired: requiredSkills.length,
    totalMatched: matchedSkills.length,
    totalMissing: missingSkills.length
  };
}

module.exports = router;