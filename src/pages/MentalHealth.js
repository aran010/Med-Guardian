import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, User, Bot, ArrowLeft, MessageCircle, Lightbulb, Heart, Download, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mentalHealthApi } from '../services/mentalHealthApi';

const MentalHealth = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI mental health companion. I'm here to listen, provide support, and help you navigate through difficult times. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/');
      if (response.ok) {
        setConnectionStatus('connected');
        // Load existing chat history if available
        loadChatHistory();
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  const loadChatHistory = async () => {
    try {
      const history = await mentalHealthApi.getChatHistory();
      if (history.length > 0) {
        setMessages(prev => [...prev, ...history]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use the real API instead of mock responses
      const apiResponse = await mentalHealthApi.sendMessage(userMessage.content);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: apiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      
      // Fallback response if API fails
      const fallbackMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting to my AI brain right now. Please check if the backend server is running, or try again in a moment. If you need immediate support, please reach out to a mental health professional or crisis hotline.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await mentalHealthApi.clearChat();
      setMessages([
        {
          id: Date.now(),
          type: 'bot',
          content: "Chat history cleared. How can I help you today?",
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
      // Still clear locally even if backend fails
      setMessages([
        {
          id: Date.now(),
          type: 'bot',
          content: "Chat history cleared. How can I help you today?",
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleExportChat = async () => {
    try {
      const chatData = await mentalHealthApi.exportChat();
      
      // Create and download the file
      const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mental-health-chat-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export chat:', error);
      alert('Failed to export chat. Please try again.');
    }
  };

  const quickStarters = [
    "I'm feeling anxious today",
    "I'm having trouble sleeping",
    "I feel overwhelmed with work",
    "I'm struggling with relationships",
    "I feel sad and don't know why",
    "I need help with stress management"
  ];

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Mental Health Companion</h1>
              <p className="text-gray-600">24/7 mental health support with AI-powered conversations</p>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className={`text-sm ${
              connectionStatus === 'connected' ? 'text-green-600' : 
              connectionStatus === 'disconnected' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {connectionStatus === 'connected' ? 'Connected to AI Backend' : 
               connectionStatus === 'disconnected' ? 'Backend Disconnected' : 'Checking Connection...'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="card h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Mental Health Companion</h3>
                      <p className="text-sm text-gray-500">Always here to listen and support you</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleExportChat}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Export Chat"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleClearChat}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Clear Chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Starters */}
              {messages.length === 1 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Quick conversation starters:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickStarters.map((starter, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(starter)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 input-field"
                  disabled={isLoading || connectionStatus !== 'connected'}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim() || connectionStatus !== 'connected'}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Features */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 text-purple-600 mr-2" />
                  Features
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Heart className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>24/7 availability</span>
                  </li>
                  <li className="flex items-start">
                    <Brain className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Real AI-powered insights</span>
                  </li>
                  <li className="flex items-start">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Coping strategies</span>
                  </li>
                  <li className="flex items-start">
                    <Download className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Chat export</span>
                  </li>
                </ul>
              </div>

              {/* Crisis Resources */}
              <div className="card bg-red-50 border-red-200">
                <h3 className="font-semibold text-red-900 mb-3">Crisis Support</h3>
                <p className="text-sm text-red-800 mb-3">
                  If you're experiencing a mental health crisis or having thoughts of self-harm, 
                  please seek immediate help:
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-red-700">
                    <strong>National Suicide Prevention Lifeline:</strong><br />
                    988 or 1-800-273-8255
                  </p>
                  <p className="text-red-700">
                    <strong>Crisis Text Line:</strong><br />
                    Text HOME to 741741
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Getting the Most Out of Our Chat</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Be honest about your feelings</li>
                  <li>• Ask specific questions</li>
                  <li>• Take breaks when needed</li>
                  <li>• Remember I'm here to support you</li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="text-xs text-gray-500 text-center">
                <p>
                  This AI companion is for support and guidance only. 
                  It's not a substitute for professional mental health care. 
                  Always consult with qualified mental health professionals for diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealth;
