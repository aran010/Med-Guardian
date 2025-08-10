import React, { useState, useRef } from 'react';
import { Camera, Upload, X, ArrowLeft, FileImage, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const XrayReader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setAnalysis(null);
    setError('');
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError('Please select an X-ray image first');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      // This would connect to your existing X-ray AI reader backend
      // For now, simulating the API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response - replace with actual API call to your X-ray AI
      const mockAnalysis = {
        findings: [
          { finding: 'Normal cardiac silhouette', confidence: 95, status: 'normal' },
          { finding: 'Clear lung fields', confidence: 92, status: 'normal' },
          { finding: 'No evidence of pneumonia', confidence: 89, status: 'normal' },
          { finding: 'Normal mediastinal contours', confidence: 87, status: 'normal' }
        ],
        abnormalities: [
          { finding: 'Mild cardiomegaly', confidence: 78, severity: 'mild', status: 'abnormal' },
          { finding: 'Possible small pleural effusion', confidence: 65, severity: 'mild', status: 'abnormal' }
        ],
        overallAssessment: 'Normal chest X-ray with minor findings',
        recommendations: [
          'Follow-up in 6 months for cardiomegaly monitoring',
          'Consider echocardiogram for cardiac evaluation',
          'Monitor for respiratory symptoms',
          'Repeat X-ray if symptoms develop'
        ],
        urgency: 'Low',
        nextSteps: 'Schedule follow-up with primary care physician for routine monitoring.'
      };

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError('Failed to analyze X-ray. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'normal' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50';
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'severe': return 'text-red-600';
      case 'moderate': return 'text-yellow-600';
      case 'mild': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI X-Ray Reader</h1>
              <p className="text-gray-600">Upload X-ray images for instant AI analysis and medical insights</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload X-Ray Image</h2>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img 
                        src={preview} 
                        alt="X-ray preview" 
                        className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={removeFile}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">JPEG, PNG up to 10MB</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 btn-primary"
                    >
                      Select X-Ray Image
                    </button>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {selectedFile && (
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze X-Ray'}
                </button>
              )}
            </div>

            {/* Instructions */}
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">📋 Upload Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Ensure the X-ray image is clear and well-lit</li>
                <li>• Include the entire area of interest in the image</li>
                <li>• Avoid blurry or rotated images</li>
                <li>• Supported formats: JPEG, PNG, BMP</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="card bg-yellow-50 border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-3">⚠️ Important Notice</h3>
              <p className="text-sm text-yellow-800">
                This AI analysis is for educational and screening purposes only. 
                It should not replace professional radiological interpretation or medical diagnosis. 
                Always consult with qualified healthcare professionals for proper medical evaluation.
              </p>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {isAnalyzing && (
              <div className="card text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your X-Ray</h3>
                <p className="text-gray-600">Our AI is examining the image for abnormalities...</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Overall Assessment */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Assessment</h3>
                  <div className="space-y-3">
                    <p className="text-gray-700">{analysis.overallAssessment}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Urgency Level:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        analysis.urgency === 'High' ? 'text-red-600 bg-red-50' :
                        analysis.urgency === 'Medium' ? 'text-yellow-600 bg-yellow-50' :
                        'text-green-600 bg-green-50'
                      }`}>
                        {analysis.urgency} Urgency
                      </span>
                    </div>
                  </div>
                </div>

                {/* Normal Findings */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Normal Findings</h3>
                  <div className="space-y-2">
                    {analysis.findings.map((finding, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">{finding.finding}</span>
                        <span className="text-sm text-green-600 font-medium">
                          {finding.confidence}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abnormalities */}
                {analysis.abnormalities.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Abnormalities Detected</h3>
                    <div className="space-y-2">
                      {analysis.abnormalities.map((abnormality, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div>
                            <span className="text-gray-700">{abnormality.finding}</span>
                            {abnormality.severity && (
                              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getSeverityColor(abnormality.severity)}`}>
                                {abnormality.severity}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-yellow-600 font-medium">
                            {abnormality.confidence}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

                {/* Next Steps */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
                  <p className="text-gray-700 mb-4">{analysis.nextSteps}</p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">When to Seek Immediate Care:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Severe chest pain or pressure</li>
                      <li>• Difficulty breathing or shortness of breath</li>
                      <li>• Coughing up blood</li>
                      <li>• Sudden severe symptoms</li>
                      <li>• Symptoms that worsen rapidly</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {!analysis && !isAnalyzing && (
              <div className="card text-center py-12">
                <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Analyze</h3>
                <p className="text-gray-600">Upload an X-ray image to get started with AI-powered analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XrayReader;
