import React, { useState } from 'react';
import SearchUser from './SearchUser';
import './NewChat.css'

const NewChat = ({ createChat }) => {
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
  
        return [...prevUsers, user.id.toString()]; // Convertir l'ID de l'utilisateur en chaîne de caractères
      }
    });
  };
  

  const handleCreateChat = () => {
    createChat(selectedUsers);
    setSelectedUsers([]);
    setIsCreating(false);
  };

  return (
    <div className="new-chat-container">
      <button onClick={() => setIsCreating(true)}>New Conversation</button>
      {isCreating && (
        <div className="create-chat">
          <SearchUser searchTerm={searchTerm} setSearchResults={setSearchResults} />
          <div className="search-results">
            {searchResults.map((user) => (
              <div key={user.id} className={selectedUsers.includes(user.id) ? 'selected-user' : ''} onClick={() => handleUserSelect(user.id)}>{user.name}</div>
            ))}
          </div>
          <div className="selected-users">
            <h3>Selected Users:</h3>
            {selectedUsers.map((userId) => (
              <div key={userId}>{userId}</div>
            ))}
          </div>
          <button onClick={handleCreateChat}>Create</button>
        </div>
      )}
    </div>
  );
};

export default NewChat;

