// NewChat.jsx
import React, { useState } from 'react';
import SearchBar from './SearchBar';
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
        return [...prevUsers, userId];
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
          <SearchBar onSearch={handleSearch} />
          <SearchUser searchTerm={searchTerm} setSearchResults={setSearchResults} />
          <div className="search-results">
            {searchResults.map((user) => (
              <div key={user.id} onClick={() => handleUserSelect(user.id)}>{user.name}</div>
            ))}
          </div>
          <div className="selected-users">
            {selectedUsers.map((userId) => (
              <div key={userId}>{userId}</div> // Afficher le nom de l'utilisateur ici
            ))}
          </div>
          <button onClick={handleCreateChat}>Create</button>
        </div>
      )}
    </div>
  );
};

export default NewChat;


