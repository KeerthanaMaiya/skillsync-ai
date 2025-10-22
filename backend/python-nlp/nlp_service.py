from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# Enhanced skills database
TECH_SKILLS = {
    'javascript': {'category': 'Frontend', 'level': 'Intermediate'},
    'react': {'category': 'Frontend', 'level': 'Intermediate'},
    'vue': {'category': 'Frontend', 'level': 'Intermediate'},
    'angular': {'category': 'Frontend', 'level': 'Advanced'},
    'typescript': {'category': 'Frontend', 'level': 'Intermediate'},
    'html': {'category': 'Frontend', 'level': 'Beginner'},
    'css': {'category': 'Frontend', 'level': 'Beginner'},
    'node.js': {'category': 'Backend', 'level': 'Intermediate'},
    'python': {'category': 'Backend', 'level': 'Intermediate'},
    'java': {'category': 'Backend', 'level': 'Advanced'},
    'spring boot': {'category': 'Backend', 'level': 'Advanced'},
    'express': {'category': 'Backend', 'level': 'Intermediate'},
    'django': {'category': 'Backend', 'level': 'Advanced'},
    'flask': {'category': 'Backend', 'level': 'Intermediate'},
    'mongodb': {'category': 'Database', 'level': 'Intermediate'},
    'mysql': {'category': 'Database', 'level': 'Intermediate'},
    'postgresql': {'category': 'Database', 'level': 'Intermediate'},
    'sql': {'category': 'Database', 'level': 'Intermediate'},
    'docker': {'category': 'DevOps', 'level': 'Intermediate'},
    'kubernetes': {'category': 'DevOps', 'level': 'Advanced'},
    'aws': {'category': 'DevOps', 'level': 'Advanced'},
    'git': {'category': 'Tools', 'level': 'Beginner'},
    'rest api': {'category': 'Backend', 'level': 'Intermediate'},
    'graphql': {'category': 'Backend', 'level': 'Intermediate'}
}

@app.route('/analyze-skills', methods=['POST'])
def analyze_skills():
    try:
        data = request.json
        job_description = data.get('job_description', '')
        
        extracted_skills = extract_skills_advanced(job_description)
        
        return jsonify({
            'success': True,
            'skills': extracted_skills,
            'total_skills': len(extracted_skills),
            'categories': categorize_skills(extracted_skills),
            'source': 'python-nlp'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def extract_skills_advanced(text):
    text_lower = text.lower()
    found_skills = []
    
    # Smart keyword matching with context
    for skill, info in TECH_SKILLS.items():
        # Check for skill with word boundaries for better accuracy
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append({
                'name': skill.title(),
                'category': info['category'],
                'level': info['level'],
                'confidence': 0.95
            })
    
    # Remove duplicates
    unique_skills = []
    seen = set()
    for skill in found_skills:
        if skill['name'] not in seen:
            unique_skills.append(skill)
            seen.add(skill['name'])
    
    return unique_skills

def categorize_skills(skills):
    categories = {}
    for skill in skills:
        category = skill['category']
        if category not in categories:
            categories[category] = []
        categories[category].append(skill)
    return categories

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Python NLP service is running!'})

if __name__ == '__main__':
    print("🚀 Starting Python NLP service on port 5001...")
    print("📡 Access at: http://localhost:5001")
    print("✅ Health check: http://localhost:5001/health")
    app.run(port=5001, debug=True)