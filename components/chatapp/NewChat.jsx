import React, { useState } from 'react';
import SearchUser from './SearchUser';
import './NewChat.css';
import { useForm } from 'react-hook-form';
import {createConversation} from '../../lib/actions/conversation.action'; 

const NewChat = ({ }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleUserSelect = (userId) => {
    setSelectedUsers(prevUsers => {
      const isSelected = prevUsers.includes(userId.toString());
      return isSelected ? prevUsers.filter(id => id !== userId.toString()) : [...prevUsers, userId.toString()];
    });
  };
  
  const handleCreateChat = async () => {
    try {
      const name = ('ISK');
      const participants = selectedUsers;
      const newConversation = await createConversation(name, participants);
      console.log('Conversation created:', newConversation);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };



return (
  <div className="new-chat-container">
    <button onClick={() => setIsCreating(true)}>New Conversation</button>
    {isCreating && (
      <form onSubmit={handleSubmit(handleCreateChat)} className="create-chat">
        <SearchUser searchTerm={searchTerm} setSearchResults={setSearchResults} />
        <div className="search-results">
          {searchResults.map(user => (
            <div key={user.id} className={selectedUsers.includes(user) ? 'selected-user' : ''} onClick={() => handleUserSelect(user.id).toString()}>
              {user.name}
            </div>
          ))}
        </div>
        <input 
          name="name" 
          {...register('name', { required: true })}
          placeholder="Conversation Name" 
        />
        {errors.name && <p>This field is required</p>}
        <button type="submit">Create</button>
      </form>
    )}
  </div>
);
};

export default NewChat;
