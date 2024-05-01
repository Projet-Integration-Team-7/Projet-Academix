// ChatList.jsx
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import './ChatList.css'; // Import the CSS file

const ChatList = ({ chats, selectChat }) => {
  const { user } = useUser();

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div key={chat._id} className="chat-list-item" onClick={() => selectChat(chat._id)}>
          {chat.name}
        </div>
      ))}
    </div>
  );
};

export default ChatList;




