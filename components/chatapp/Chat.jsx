import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import NewChat from './NewChat';
import { sendMessage, createConversation, addUser, userLeft } from './apiService'; 

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
      // Update the chat messages in the local state if needed
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const addUserToChat = async (conversationId, userId) => {
    try {
      await addUser(conversationId, userId);
      // Update the chat participants in the local state if needed
    } catch (error) {
      console.error('Error adding user to chat:', error);
    }
  };

  const userLeftChat = async (conversationId, userId) => {
    try {
      await userLeft(conversationId, userId);
      // Update the chat participants in the local state if needed
    } catch (error) {
      console.error('Error removing user from chat:', error);
    }
  };

  return (
    <div className="chat-page">
      <div className="conversation-section">
        <ChatList chats={chats} selectChat={selectChat} />
      </div>
      <div className="chatbox-section">
        {selectedChat ? (
          <ChatBox
            chat={selectedChat}
            sendMessage={sendMessageToChat}
            addUser={addUserToChat}
            userLeft={userLeftChat}
          />
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

