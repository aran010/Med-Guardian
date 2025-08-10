import React, { useState } from 'react';
import { Heart, AlertTriangle, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { symptomAnalyzerApi } from '../services/symptomAnalyzerApi';

const SymptomAnalyzer = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Enhanced symptom analysis logic - now using API service
  const analyzeSymptoms = async (symptomText) => {
    try {
      // Try to use the API service first
      const result = await symptomAnalyzerApi.analyzeSymptoms(symptomText);
      return result;
    } catch (error) {
      console.error('API analysis failed, using fallback:', error);
      // Fallback to local analysis if API fails
      return symptomAnalyzerApi.fallbackAnalysis(symptomText);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please describe your symptoms');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalysis(null);

    try {
      // Use the enhanced analysis logic with API service
      const analysisResult = await analyzeSymptoms(symptoms);
      setAnalysis(analysisResult);
    } catch (err) {
      setError('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Symptom Analyzer</h1>
              <p className="text-gray-600">Describe your symptoms for AI-powered health insights</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Describe Your Symptoms</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                    What symptoms are you experiencing?
                  </label>
                  <textarea
                    id="symptoms"
                    rows="6"
                    className="input-field"
                    placeholder="Describe your symptoms in detail. For example: 'I have a headache, fever of 101°F, and fatigue for the past 2 days'"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !symptoms.trim()}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze Symptoms'
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800 text-sm">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {isLoading && (
              <div className="card text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Symptoms...</h3>
                <p className="text-gray-600">Our AI is processing your symptoms to provide personalized insights.</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Urgency Level */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Urgency Level</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(analysis.urgency)}`}>
                      {analysis.urgency} Priority
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {analysis.nextSteps}
                  </p>
                </div>

                {/* Possible Conditions */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Possible Conditions</h3>
                  <div className="space-y-3">
                    {analysis.possibleConditions.map((condition, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{condition.condition}</div>
                          <div className="text-sm text-gray-500">
                            Confidence: {condition.confidence}% | Severity: 
                            <span className={`ml-1 font-medium ${getSeverityColor(condition.severity)}`}>
                              {condition.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Important Disclaimer</h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        This AI analysis is for informational purposes only and should not replace professional medical advice. 
                        Always consult with a qualified healthcare provider for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!analysis && !isLoading && (
              <div className="card text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Analyze</h3>
                <p className="text-gray-600">Describe your symptoms on the left to get started with AI-powered health insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomAnalyzer;
