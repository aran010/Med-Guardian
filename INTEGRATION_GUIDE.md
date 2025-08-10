# 🚀 Mental Health Chatbot Integration Guide

## ✅ What's Been Integrated

Your mental health chatbot is now fully integrated into your main healthcare website! Here's what I've accomplished:

### 🔗 **Backend Integration**
- **Flask Backend**: Enhanced with CORS support for React communication
- **API Endpoints**: Created RESTful API endpoints for the React frontend
- **Real AI Responses**: Connected to Google Gemini AI for dynamic, contextual responses
- **Session Management**: Persistent chat history across conversations

### 🎨 **Frontend Integration**
- **React Component**: Updated `MentalHealth.js` to use real API instead of mock responses
- **API Service**: Created `mentalHealthApi.js` for backend communication
- **Real-time Status**: Connection status indicator showing backend connectivity
- **Enhanced Features**: Export chat, clear chat, and real AI responses

## 🌐 **How to Access**

### **Main Healthcare Website**
- **URL**: `http://localhost:3000` (React app)
- **Mental Health Page**: Navigate to `/mental-health` or click "Mental Health" in navigation

### **Backend API**
- **URL**: `http://127.0.0.1:5001` (Flask backend - using port 5001 to avoid AirPlay conflict)
- **Status**: Running with CORS enabled for React frontend

## 🚀 **Getting Started**

### **1. Start Both Servers**

**Terminal 1 - Flask Backend:**
```bash
cd mental-health-gemini
source venv/bin/activate
python app.py
```

**Terminal 2 - React Frontend:**
```bash
cd ai-symptom-analyzer/healthcare-hub
npm start
```

### **2. Access Your Website**
- Open browser to `http://localhost:3000`
- Navigate to Mental Health section
- Start chatting with your AI companion!

## 🔧 **How It Works**

### **Frontend → Backend Communication**
1. **User types message** in React component
2. **API call** sent to Flask backend (`/api/chat`)
3. **Gemini AI** generates contextual response
4. **Response returned** to React frontend
5. **Chat updated** with real AI response

### **Features Available**
- ✅ **Real AI Responses** (not hardcoded!)
- ✅ **Chat History** (persistent across sessions)
- ✅ **Export Chat** (download conversation as JSON)
- ✅ **Clear Chat** (start fresh conversations)
- ✅ **Connection Status** (shows backend connectivity)
- ✅ **Quick Starters** (pre-written conversation starters)

## 🎯 **Integration Benefits**

### **Before (Mock Responses)**
- Static, predefined responses
- No real AI intelligence
- Limited conversation depth
- No persistence

### **After (Real Integration)**
- Dynamic, contextual AI responses
- Real Google Gemini AI intelligence
- Deep, meaningful conversations
- Persistent chat history
- Professional mental health support

## 🔍 **Troubleshooting**

### **If Chat Doesn't Work:**
1. **Check Backend**: Ensure Flask is running on port 5001 (not 5000 due to AirPlay conflict)
2. **Check Frontend**: Ensure React is running on port 3000
3. **Check Console**: Look for connection errors in browser console
4. **Check Status**: Look for connection status indicator in UI

### **Common Issues:**
- **Port 5000 Conflict**: macOS AirPlay uses port 5000, so we use port 5001
- **CORS Errors**: Backend needs to be running with CORS enabled
- **API Timeouts**: Check if Gemini API key is valid
- **Connection Failed**: Ensure both servers are running

## 🎉 **You're All Set!**

Your mental health chatbot is now:
- **Fully integrated** with your healthcare website
- **Using real AI** (Google Gemini)
- **Professional quality** with modern UI
- **Ready for users** to access and use

**Next Steps:**
1. Test the integration by chatting with the AI
2. Customize the UI further if needed
3. Deploy to production when ready
4. Monitor usage and gather feedback

## 📞 **Need Help?**

If you encounter any issues:
1. Check the browser console for errors
2. Verify both servers are running
3. Check the connection status indicator
4. Ensure your `.env` file has the correct API key
5. **Note**: Backend runs on port 5001, not 5000 (due to macOS AirPlay)

**Happy coding! 🚀**
