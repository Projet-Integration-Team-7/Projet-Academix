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

  const handleCreateChat = async (data) => {
    console.error('hop');

  setIsCreating(true); // Activer l'indicateur de création
  try {
    console.error('hop');

    const { name } = data;
    const participants = selectedUsers.map(user => user.id.toString()); // Utiliser directement l'array des IDs en tant que chaînes de caractères
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
      <form onSubmit={handleSubmit(handleCreateChat)} className="create-chat flex-col gap-4 place-items-center">
        <SearchUser searchTerm={searchTerm} setSearchResults={setSearchResults} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
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
