import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { user: true, message: inputMessage.trim() }];
    setMessages(newMessages);
    setInputMessage('');

    try {
      const response = await axios.post('/api/webhook', { message: inputMessage.trim() });
      const aiResponse = response.data.message;
      setMessages([...newMessages, { user: false, message: aiResponse }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-assistant-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user? 'user' : 'ai'}`}>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="ai-assistant-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AIAssistant;