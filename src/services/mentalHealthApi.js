const API_BASE_URL = 'http://127.0.0.1:5001';

export const mentalHealthApi = {
  // Send a message to the mental health chatbot
  async sendMessage(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          user_input: message
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      
      // Parse the HTML response to extract the AI response
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      
      // Look for the AI response in the chat history
      const chatHistory = doc.querySelectorAll('.message.ai-message .message-content');
      if (chatHistory.length > 0) {
        // Get the last AI message
        const lastAiMessage = chatHistory[chatHistory.length - 1];
        const aiText = lastAiMessage.textContent.replace('AI: ', '').trim();
        return aiText;
      }
      
      // Fallback: look for any response text
      const responseDiv = doc.querySelector('.response p');
      if (responseDiv) {
        return responseDiv.textContent.trim();
      }
      
      throw new Error('No response found');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get chat history from the backend
  async getChatHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      
      const messages = [];
      const userMessages = doc.querySelectorAll('.message.user-message .message-content');
      const aiMessages = doc.querySelectorAll('.message.ai-message .message-content');
      
      // Combine user and AI messages in chronological order
      const allMessages = [];
      
      userMessages.forEach((msg, index) => {
        const userText = msg.textContent.replace('You: ', '').trim();
        allMessages.push({
          type: 'user',
          content: userText,
          timestamp: new Date()
        });
      });
      
      aiMessages.forEach((msg, index) => {
        const aiText = msg.textContent.replace('AI: ', '').trim();
        allMessages.push({
          type: 'bot',
          content: aiText,
          timestamp: new Date()
        });
      });
      
      return allMessages;
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  },

  // Clear chat history
  async clearChat() {
    try {
      const response = await fetch(`${API_BASE_URL}/clear-chat`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing chat:', error);
      throw error;
    }
  },

  // Export chat history
  async exportChat() {
    try {
      const response = await fetch(`${API_BASE_URL}/export-chat`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error exporting chat:', error);
      throw error;
    }
  }
};
