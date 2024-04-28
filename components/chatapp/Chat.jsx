
import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import NewChat from './NewChat';
import { sendMessage, createConversation, addUser, userLeft } from './apiService'; // Importez vos fonctions API

const ChatApp = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const selectChat = (index) => {
    setSelectedChat(chats[index]);
  };

  const createChat = async (name) => {
    try {
      const newChat = await createConversation(name);
      setChats([...chats, newChat]);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const sendMessageToChat = async (conversationId, message) => {
    try {
      await sendMessage(conversationId, message);
      // Mettez à jour les messages du chat dans l'état local si nécessaire
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Définissez les fonctions addUser et userLeft de manière similaire à sendMessageToChat

  return (
    <div className="chat-page">
      <div className="conversation-section">
        <ChatList chats={chats} selectChat={selectChat} />
      </div>
      <div className="chatbox-section">
        {selectedChat ? (
          <ChatBox chat={selectedChat} sendMessage={sendMessageToChat} />
        ) : (
          <div className="empty-message">Please select a conversation</div>
        )}
      </div>
      <div className="new-chat-section">
        <NewChat createChat={createChat} />
      </div>
    </div>
  );
};

export default ChatApp;
