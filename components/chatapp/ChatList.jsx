// ChatList.jsx
import React from 'react';
import { useUser } from '@clerk/clerk-react'; 

const ChatList = ({ chats, selectChat }) => {
  const { user } = useUser();

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div key={chat._id} onClick={() => selectChat(chat._id)}>
          {chat.name}
        </div>
      ))}
    </div>
  );
};

export default ChatList;



