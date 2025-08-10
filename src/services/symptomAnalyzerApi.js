const API_BASE_URL = 'http://127.0.0.1:5002';

export const symptomAnalyzerApi = {
  // Analyze symptoms using AI
  async analyzeSymptoms(symptoms) {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptoms
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      // Fallback to local analysis if API fails
      return this.fallbackAnalysis(symptoms);
    }
  },

  // Fallback analysis when API is not available
  fallbackAnalysis(symptoms) {
    const text = symptoms.toLowerCase();
    let conditions = [];
    let urgency = 'Low';
    let recommendations = [];

    // More sophisticated symptom analysis
    const symptomPatterns = {
      'headache': {
        conditions: [
          { condition: 'Tension Headache', confidence: 80, severity: 'Low' },
          { condition: 'Migraine', confidence: 70, severity: 'Medium' },
          { condition: 'Sinus Headache', confidence: 65, severity: 'Low' }
        ],
        recommendations: [
          'Rest in a quiet, dark room',
          'Stay hydrated',
          'Consider over-the-counter pain relievers',
          'Avoid bright lights and loud noises'
        ],
        urgency: 'Low'
      },
      'fever': {
        conditions: [
          { condition: 'Viral Infection', confidence: 85, severity: 'Medium' },
          { condition: 'Bacterial Infection', confidence: 70, severity: 'Medium' },
          { condition: 'Inflammatory Condition', confidence: 60, severity: 'Medium' }
        ],
        recommendations: [
          'Monitor temperature regularly',
          'Stay hydrated with water and clear fluids',
          'Rest and avoid strenuous activity',
          'Consider fever-reducing medications if above 101°F'
        ],
        urgency: 'Medium'
      },
      'chest pain': {
        conditions: [
          { condition: 'Musculoskeletal Pain', confidence: 75, severity: 'Medium' },
          { condition: 'Acid Reflux', confidence: 70, severity: 'Low' },
          { condition: 'Anxiety', confidence: 65, severity: 'Low' }
        ],
        recommendations: [
          'Seek immediate medical attention if pain is severe',
          'Avoid strenuous activity',
          'Monitor for shortness of breath',
          'Consider antacids if related to eating'
        ],
        urgency: 'High'
      },
      'shortness of breath': {
        conditions: [
          { condition: 'Anxiety or Panic Attack', confidence: 80, severity: 'Medium' },
          { condition: 'Respiratory Infection', confidence: 75, severity: 'Medium' },
          { condition: 'Allergic Reaction', confidence: 70, severity: 'Medium' }
        ],
        recommendations: [
          'Try deep breathing exercises',
          'Sit in an upright position',
          'Seek immediate medical attention if severe',
          'Avoid triggers like smoke or allergens'
        ],
        urgency: 'High'
      },
      'abdominal pain': {
        conditions: [
          { condition: 'Gastritis', confidence: 80, severity: 'Medium' },
          { condition: 'Food Poisoning', confidence: 75, severity: 'Medium' },
          { condition: 'Irritable Bowel Syndrome', confidence: 70, severity: 'Low' }
        ],
        recommendations: [
          'Avoid spicy or fatty foods',
          'Stay hydrated',
          'Consider over-the-counter antacids',
          'Seek medical attention if pain is severe or persistent'
        ],
        urgency: 'Medium'
      },
      'dizziness': {
        conditions: [
          { condition: 'Benign Paroxysmal Positional Vertigo', confidence: 75, severity: 'Medium' },
          { condition: 'Inner Ear Infection', confidence: 70, severity: 'Medium' },
          { condition: 'Low Blood Pressure', confidence: 65, severity: 'Low' }
        ],
        recommendations: [
          'Move slowly and avoid sudden movements',
          'Stay hydrated',
          'Avoid driving or operating machinery',
          'Consider seeing an ENT specialist if persistent'
        ],
        urgency: 'Medium'
      },
      'fatigue': {
        conditions: [
          { condition: 'Sleep Deprivation', confidence: 85, severity: 'Low' },
          { condition: 'Stress or Anxiety', confidence: 80, severity: 'Low' },
          { condition: 'Vitamin Deficiency', confidence: 70, severity: 'Low' }
        ],
        recommendations: [
          'Ensure 7-9 hours of quality sleep',
          'Practice stress management techniques',
          'Maintain a balanced diet',
          'Consider multivitamins if diet is poor'
        ],
        urgency: 'Low'
      },
      'nausea': {
        conditions: [
          { condition: 'Gastroenteritis', confidence: 80, severity: 'Medium' },
          { condition: 'Food Poisoning', confidence: 75, severity: 'Medium' },
          { condition: 'Morning Sickness', confidence: 70, severity: 'Low' }
        ],
        recommendations: [
          'Stay hydrated with small sips of water',
          'Avoid solid foods until nausea subsides',
          'Try ginger tea or ginger candies',
          'Seek medical attention if vomiting persists for more than 24 hours'
        ],
        urgency: 'Medium'
      },
      'joint pain': {
        conditions: [
          { condition: 'Muscle Strain', confidence: 80, severity: 'Low' },
          { condition: 'Arthritis', confidence: 70, severity: 'Medium' },
          { condition: 'Fibromyalgia', confidence: 60, severity: 'Medium' }
        ],
        recommendations: [
          'Apply ice or heat therapy',
          'Gentle stretching exercises',
          'Consider over-the-counter pain relievers',
          'Avoid overuse of affected joints'
        ],
        urgency: 'Low'
      },
      'rash': {
        conditions: [
          { condition: 'Contact Dermatitis', confidence: 80, severity: 'Low' },
          { condition: 'Allergic Reaction', confidence: 75, severity: 'Medium' },
          { condition: 'Eczema', confidence: 70, severity: 'Low' }
        ],
        recommendations: [
          'Avoid scratching the affected area',
          'Use gentle, fragrance-free skincare products',
          'Consider over-the-counter hydrocortisone cream',
          'Seek medical attention if rash spreads or becomes severe'
        ],
        urgency: 'Low'
      }
    };

    // Analyze symptoms based on patterns
    let maxUrgency = 'Low';
    let allConditions = [];
    let allRecommendations = [];

    for (const [pattern, data] of Object.entries(symptomPatterns)) {
      if (text.includes(pattern)) {
        allConditions.push(...data.conditions);
        allRecommendations.push(...data.recommendations);
        
        // Update urgency level
        if (data.urgency === 'High') {
          maxUrgency = 'High';
        } else if (data.urgency === 'Medium' && maxUrgency !== 'High') {
          maxUrgency = 'Medium';
        }
      }
    }

    // If no specific patterns match, provide general analysis
    if (allConditions.length === 0) {
      // Analyze text for general health indicators
      if (text.includes('pain') || text.includes('hurt')) {
        allConditions.push(
          { condition: 'General Pain', confidence: 70, severity: 'Medium' },
          { condition: 'Musculoskeletal Issue', confidence: 65, severity: 'Medium' }
        );
        allRecommendations.push(
          'Rest the affected area',
          'Apply ice or heat therapy',
          'Consider over-the-counter pain relievers',
          'Monitor for worsening symptoms'
        );
        maxUrgency = 'Medium';
      } else if (text.includes('tired') || text.includes('exhausted')) {
        allConditions.push(
          { condition: 'Fatigue', confidence: 80, severity: 'Low' },
          { condition: 'Stress-Related Symptoms', confidence: 75, severity: 'Low' }
        );
        allRecommendations.push(
          'Ensure adequate sleep',
          'Practice stress management',
          'Maintain regular exercise routine',
          'Consider dietary improvements'
        );
      } else if (text.includes('sick') || text.includes('ill')) {
        allConditions.push(
          { condition: 'General Illness', confidence: 75, severity: 'Medium' },
          { condition: 'Viral Infection', confidence: 70, severity: 'Medium' }
        );
        allRecommendations.push(
          'Rest and stay hydrated',
          'Monitor symptoms closely',
          'Avoid contact with others',
          'Seek medical attention if symptoms worsen'
        );
        maxUrgency = 'Medium';
      } else {
        // Default analysis for unrecognized symptoms
        allConditions = [
          { condition: 'General Malaise', confidence: 60, severity: 'Low' },
          { condition: 'Stress-Related Symptoms', confidence: 70, severity: 'Low' },
          { condition: 'Seasonal Illness', confidence: 65, severity: 'Low' }
        ];
        allRecommendations = [
          'Rest and stay hydrated',
          'Monitor symptoms for 48-72 hours',
          'Practice stress management techniques',
          'Consider consulting a healthcare provider if symptoms persist'
        ];
      }
    }

    // Remove duplicate recommendations
    allRecommendations = [...new Set(allRecommendations)];

    // Add general recommendations
    if (!allRecommendations.includes('Rest and stay hydrated')) {
      allRecommendations.push('Rest and stay hydrated');
    }
    if (!allRecommendations.includes('Monitor symptoms for 48-72 hours')) {
      allRecommendations.push('Monitor symptoms for 48-72 hours');
    }

    return {
      possibleConditions: allConditions,
      recommendations: allRecommendations,
      urgency: maxUrgency,
      nextSteps: this.getNextSteps(maxUrgency, allConditions)
    };
  },

  getNextSteps(urgency, conditions) {
    if (urgency === 'High') {
      return 'Seek medical attention immediately. These symptoms may require urgent evaluation by a healthcare provider.';
    } else if (urgency === 'Medium') {
      return 'Monitor symptoms closely. If they worsen or persist beyond 3-5 days, consult a healthcare provider.';
    } else {
      return 'Continue monitoring symptoms. If they persist beyond 7 days or worsen, consult a healthcare provider.';
    }
  }
};
