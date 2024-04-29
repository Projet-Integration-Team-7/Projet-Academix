
import React, { useState } from 'react';
import SearchUser from './SearchUser';
import './NewChat.css';
import { useForm } from 'react-hook-form'
import Conversation, {  } from '../../lib/models/conversation'; // Update the import path

const NewChat = ({ createChat }) => {
  const { register, handleSubmit, errors } = useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevUsers) => {
      if (prevUsers.includes(userId)) {
        return prevUsers.filter((id) => id !== userId);
      } else {
        const user = searchResults.find((user) => user.id === userId);
        if (!user) {
          return prevUsers;
        }

        return [...prevUsers, user.id.toString()];
      }
    });
  };

  const handleCreateChat = async () => {
    try {
      const name = 'New Conversation'; 
      const participants = selectedUsers.map(user => ({ userId: user.id })); 
      const newConversation = await Conversation.createConversation(name, participants, []);
      console.log('Conversation created:', newConversation);
      createChat(newConversation._id);
      setSelectedUsers([]);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="new-chat-container">
      <button onClick={() => setIsCreating(true)}>New Conversation</button>
      {isCreating && (
        <form className="create-chat" onSubmit={handleSubmit(handleCreateChat)}>
          <SearchUser searchTerm={searchTerm} setSearchResults={setSearchResults} />
          <div className="search-results">
            {searchResults.map((user) => (
              <div key={user.id} className={selectedUsers.includes(user.id) ? 'selected-user' : ''} onClick={() => handleUserSelect(user.id)}>{user.name}</div>
            ))}
          </div>
          <input name="name" {...register('name', { required: true })} placeholder="Conversation Name" />
          {errors && errors.name && <p>This field is required</p>}
          <button type="submit">Create</button>
        </form>
      )}
    </div>
  );
};

export default NewChat;