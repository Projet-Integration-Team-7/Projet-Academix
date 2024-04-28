// SearchUser.jsx
import React from 'react';
import { useClerk } from '@clerk/clerk-react';

const SearchUser = ({ searchTerm, setSearchResults }) => {
  const clerk = useClerk();

  const searchUser = async () => {
    try {
      const users = await clerk.listUsers({ filters: { search: searchTerm } });
      setSearchResults(users.items);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  return (
    <div className="search-results">
      {/* Afficher les résultats de la recherche ici */}
    </div>
  );
};

export default SearchUser;









