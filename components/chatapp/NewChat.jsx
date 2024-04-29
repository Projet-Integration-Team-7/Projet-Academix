import React, { useState } from 'react';
import SearchUser from './SearchUser';
import './NewChat.css';
import { useForm } from 'react-hook-form';
import Conversation from '../../lib/actions/conversation.action'; // Assurez-vous que ce chemin est correct

const NewChat = ({ createChat }) => {
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

  const handleCreateChat = async (data) => {
  setIsCreating(true); // Activer l'indicateur de création
  try {
    console.error('hop');

    const { name } = data;
    const participants = selectedUsers; // Utiliser directement l'array des IDs
    const newConversation = await Conversation.createConversation(name, participants.toString);
    console.log('Conversation created:', newConversation);
    createChat(newConversation._id); // Supposé que createChat est une fonction pour gérer l'ID créé
    setSelectedUsers([]); // Réinitialiser les utilisateurs sélectionnés
    setIsCreating(false); // Désactiver l'indicateur de création
  } catch (error) {
    console.error('Error creating chat:', error);
    setIsCreating(false); // Assurez-vous de désactiver isCreating même en cas d'erreur
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
            <div key={user.id} className={selectedUsers.includes(user.id.toString()) ? 'selected-user' : ''} onClick={() => handleUserSelect(user.id)}>
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
