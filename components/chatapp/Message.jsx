// Message.jsx
import React from 'react';
import { useUser } from '@clerk/clerk-react'; // Clerk pour gérer les utilisateurs

const Message = ({ message }) => {
  const { user } = useUser();

  return (
    <div className={`message ${message.sender === user.fullName ? 'sent' : 'received'}`}>
      <div>{message.sender}</div>
      <div>{message.text}</div>
    </div>
  );
};

export default Message;




