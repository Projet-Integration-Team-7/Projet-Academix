import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/clerk-react'; 
import './AIAssistant.css';

const apiUrl = 'http://localhost:5000/message';

const AIAssistant = () => {
  const pathname = usePathname();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useUser(); // Access the user object from Clerk

  useEffect(() => {
    async function sendInitialMessage() {
      if (user) {
        try {
          const response = await axios.post(apiUrl, { id_utilisateur: user.id, saisie_utilisateur: '' });
          const aiResponse = response.data.message;
          setMessages([...messages, { user: false, message: aiResponse }]);
        } catch (error) {
          console.error('Error sending initial message:', error);
        }
      }
    }

    sendInitialMessage();
  }, []); // Empty dependency array to run only once when component mounts

  async function handleUserInput(event) {
    event.preventDefault();
    const aiResponse = await sendRequest(inputMessage.trim(), user.id);
    setMessages([...messages, { user: true, message: inputMessage.trim() }, { user: false, message: aiResponse }]);
    setInputMessage('');
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleUserInput(event);
    }
  }

  if (pathname === '/chatbot') {
    return (
      <div className="ai-assistant-container">
        <div className="ai-assistant-title">Assistant Personnel</div>
        <div className="ai-assistant-messages">
          <div className="message ai">Bonjour! Comment puis-je vous aider aujourd'hui ?</div>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.user ? 'user' : 'ai'}`}>
              {msg.message}
            </div>
          ))}
        </div>
        <div className="ai-assistant-input">
  <div className="input-container">
    <input
      type="text"
      placeholder="Entrez votre question..."
      value={inputMessage}
      onChange={(e) => setInputMessage(e.target.value)}
      onKeyPress={handleKeyPress}
    />
  </div>
  <button onClick={handleUserInput}></button>
</div>
      </div>
    );
    
    
  } else {
    return null; // Ne rien afficher si le chemin n'est pas /chatbot
  }
};

export default AIAssistant;
