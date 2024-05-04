import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { redirect, usePathname } from 'next/navigation';
import { useUser } from '@clerk/clerk-react'; 
import './AIAssistant.css';
import FileUpload from './FileUpload';

const apiUrl = 'https://academixbackend-b7d3e8ece074.herokuapp.com/message';

// Function to send a request to the OpenAI API
async function sendRequest(prompt, userId) {
  try {
    const response = await axios.post(apiUrl, { id_utilisateur: userId, saisie_utilisateur: prompt });
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
  const { user } = useUser();

  // if (!user || !user.onboarded) {
  //   redirect('/onboarding');
  //   return null;
  // }

  useEffect(() => {
    async function sendInitialMessage() {
      if (user) {
        try {
          const response = await axios.post(apiUrl, { id_utilisateur: user.id, saisie_utilisateur: 'Bonjour' });
          const aiResponse = response.data.message;
          setMessages([...messages, { user: false, message: aiResponse }]);
        } catch (error) {
          console.error('Error sending initial message:', error);
        }
      }else{
        
      }
    }

    sendInitialMessage();
  }, []); 

  async function handleUserInput(event) {
    event.preventDefault();
    const userMessage = inputMessage.trim()
    setMessages([...messages, {user:true, message: userMessage}])
    setInputMessage('');
    const aiResponse = await sendRequest(userMessage, user.id);
    setMessages([...messages,{user:true, message: userMessage}, { user: false, message: aiResponse }]);
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
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.user ? 'user' : 'ai'}`}>
              <div className="message-title">{msg.user ? 'Vous' : 'Assistant Personnel'}</div>
              {msg.message}
            </div>
          ))}
        </div>
        <div className="ai-assistant-input">
          <div className="input-container">
          <FileUpload /> 
          <input
  type="text"
  placeholder="Entrez votre question..."
  value={inputMessage}
  onChange={(e) => setInputMessage(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && handleKeyPress(e)}
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
