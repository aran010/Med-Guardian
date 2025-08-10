import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Globe, Clock, Newspaper } from 'lucide-react';

const DiseaseOutbreak = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setArticles([
        {
          title: "Rising Cases of Respiratory Illnesses in Northern Regions",
          description: "Health officials report an increase in flu-like symptoms across multiple counties, prompting investigation into potential outbreak patterns.",
          source: "Health News Network",
          publishedAt: "2024-01-15T10:30:00Z",
          severity: "medium"
        },
        {
          title: "New Strain of Seasonal Virus Detected in Urban Areas",
          description: "Laboratory analysis reveals genetic variations in common seasonal viruses, raising concerns about vaccine effectiveness.",
          source: "Medical Research Daily",
          publishedAt: "2024-01-14T15:45:00Z",
          severity: "high"
        },
        {
          title: "Global Health Organization Issues Travel Advisory",
          description: "WHO recommends enhanced screening measures for travelers from regions experiencing unusual disease activity.",
          source: "World Health Organization",
          publishedAt: "2024-01-13T09:15:00Z",
          severity: "medium"
        },
        {
          title: "Local Hospitals Report Surge in Emergency Visits",
          description: "Emergency departments across the city are experiencing higher than normal patient volumes with respiratory complaints.",
          source: "City Health Department",
          publishedAt: "2024-01-12T14:20:00Z",
          severity: "high"
        },
        {
          title: "AI-Powered Early Warning System Detects Anomalies",
          description: "Machine learning algorithms have identified unusual patterns in health data that may indicate emerging public health threats.",
          source: "AI Health Analytics",
          publishedAt: "2024-01-11T11:00:00Z",
          severity: "low"
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4" />;
      case 'low':
        return <Globe className="w-4 h-4" />;
      default:
        return <Newspaper className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
            <h2 className="mt-6 text-xl font-semibold text-gray-700">Scanning for health threats...</h2>
            <p className="mt-2 text-gray-500">Analyzing global health data and news sources</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-xl font-semibold text-gray-700">Error Loading Data</h2>
            <p className="mt-2 text-gray-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🦠 AI Disease Outbreak Detector
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time monitoring of global health threats using AI-powered analysis of news, 
            social media, and health data to detect early warning signs of disease outbreaks.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {articles.filter(a => a.severity === 'high').length}
            </div>
            <div className="text-gray-600">High Risk Alerts</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {articles.filter(a => a.severity === 'medium').length}
            </div>
            <div className="text-gray-600">Medium Risk Alerts</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {articles.filter(a => a.severity === 'low').length}
            </div>
            <div className="text-gray-600">Low Risk Alerts</div>
          </div>
        </div>

        {/* Live Feed */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-primary-600" />
              Live Health Threat Feed
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </div>
          </div>

          <div className="space-y-6">
            {articles.map((article, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-6 py-4 bg-gray-50 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(article.severity)}`}>
                        {getSeverityIcon(article.severity)}
                        <span className="ml-1 capitalize">{article.severity} Risk</span>
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Source: <span className="font-medium">{article.source}</span>
                      </span>
                      
                      <div className="flex gap-2">
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                          Read More
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-700">
                          Share Alert
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
              How It Works
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>• AI algorithms continuously monitor global health data sources</p>
              <p>• Natural language processing analyzes news articles and social media</p>
              <p>• Pattern recognition identifies unusual disease activity</p>
              <p>• Real-time alerts provide early warning of potential outbreaks</p>
              <p>• Risk assessment based on multiple data points and historical patterns</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-primary-600" />
              Data Sources
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>• Global health organization reports</p>
              <p>• News media and health publications</p>
              <p>• Social media trend analysis</p>
              <p>• Hospital and clinic data</p>
              <p>• Government health department alerts</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Informed, Stay Safe</h3>
            <p className="text-primary-100 mb-6">
              Get real-time alerts about potential health threats in your area and around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-700 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Subscribe to Alerts
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseOutbreak;
