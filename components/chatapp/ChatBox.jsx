"use client"
import React, { useState, useEffect } from 'react';
import Message from './Message';
import './ChatBox.css'

const ChatBox = ({ chat }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(chat.messages);

  useEffect(() => {
    // Simuler la réception de nouveaux messages
    const timer = setInterval(() => {
      setMessages([...messages, { sender: 'Bot', text: 'New message' }]);
    }, 3000);

    return () => clearInterval(timer);
  }, [messages]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      setMessages([...messages, { sender: 'You', text: message }]);
      setMessage('');
    }
  };

  return (
    <div className="chat-box">
      <div className="section-title">Chat</div>
      <div className="messages">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          autoFocus
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;


