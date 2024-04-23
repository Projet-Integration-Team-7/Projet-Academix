import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/clerk-react'; // Import useUser hook from Clerk
import './AIAssistant.css';

const apiUrl = 'http://localhost:5000/message';

// Function to send a request to the OpenAI API
async function sendRequest(prompt) {
  try {
    const response = await axios.post(apiUrl, { message: prompt });
    return response.data.message;
  } catch (error) {
    console.error('Error sending request:', error);
    throw error;
  }
}

const AIAssistant = () => {
  const pathname = usePathname();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useUser(); // Access the user object from Clerk

  // Function to handle user input and display the AI's response
  async function handleUserInput(event) {
    event.preventDefault();
    const aiResponse = await sendRequest(inputMessage, messages.map(msg => msg.message).join('\n'));
    setMessages([...messages, { user: true, message: inputMessage.trim() }, { user: false, message: aiResponse }]);
    setInputMessage('');
  }

  useEffect(() => {
    if (user) {
      // Log the user ID when the component mounts
      console.log('User ID:', user.id);
    }
  }, [user]);

  if (pathname === '/chatbot') {
    return (
      <div className="ai-assistant-container">
        <div className="ai-assistant-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.user ? 'user' : 'ai'}`}>
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
          <button onClick={handleUserInput}>Send</button>
        </div>
      </div>
    );
  } else {
    return null; // Render nothing if the path is not /chatbot
  }
};

export default AIAssistant;
