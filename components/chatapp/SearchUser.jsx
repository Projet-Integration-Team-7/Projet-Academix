import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import { fetchUsers, fetchUser } from "@/lib/actions/user.actions";
import { Button } from '../ui/button';


const SearchUser = ({ searchParams }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useClerk();
  const [selectedUsers, setSelectedUsers] = useState([]); 

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!user) {
      console.log("No user found, redirecting...");
      window.location.href = '/login';
      return;
    }

    const fetchUsersData = async () => {
      const result = await fetchUsers({
        userId: user.id.toString(), // Convertir en chaîne
        searchString: searchParams?.q,
        pageNumber: page
      });

      if (result) {
        setUsers(result.users || []);
        setIsNext(result.isNext || false);
      }
    };

    fetchUsersData();
  }, [user, page, searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchUsers({
      userId: user.id.toString(), // Convertir en chaîne
      searchString: searchQuery,
      pageNumber: 1
    }).then(result => {
      if (result) {
        setUsers(result.users || []);
        setIsNext(result.isNext || false);
      }
    });
  };

  const handleUserSelect = async (userId) => {
    const user = await fetchUser(userId);
    if (!user) {
      throw new Error("User not found"); 
    }

    const updatedSelectedUsers = [...selectedUsers];
    if (updatedSelectedUsers.map(select => select._id).includes(user._id)) {
      const index = updatedSelectedUsers.findIndex(select => select._id === user._id);
      if (index > -1) {
        updatedSelectedUsers.splice(index, 1);
      }
    }
    else {
      updatedSelectedUsers.push(user);
    }
    
    setSelectedUsers(updatedSelectedUsers);
  }

  const filteredUsers = users.filter(person => !selectedUsers.some(selected => selected.id === person.id));

  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <div className=' mt-5 border-2 rounded-md p-2'>
        <h2 className='text-light-1 underline '>Selected Users</h2>
        <ul className=''>
          {selectedUsers.map(person => (
            <li key={person.id} className='flex justify-between'>
              <UserCard
                id={JSON.stringify(person.id)}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType='User'
                usage='chat'
              />
              <Button key={person.id} className="user-card_btn" onClick={() => handleUserSelect(person.id)} >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className='mt-14 flex flex-col gap-9'>
        {filteredUsers.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          filteredUsers.map(person => (
            <div className='flex justify-between'>
              <UserCard
                key={JSON.stringify(person.id)}
                id={JSON.stringify(person.id)}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType='User'
                usage='chat'
              />
              <Button className="user-card_btn" onClick={() => handleUserSelect(person.id)} >
                Add
              </Button>
            </div>
          ))
        )}
      </div>
      <Pagination
        path='search'
        pageNumber={page}
        setPage={(newPage) => {
          setPage(newPage);
          fetchUsers({
            userId: user.id.toString(), // Convertir en chaîne
            searchString: searchQuery || (searchParams && searchParams.q),
            pageNumber: newPage
          }).then(result => {
            if (result) {
              setUsers(result.users || []);
              setIsNext(result.isNext || false);
            }
          });
        }}
        isNext={isNext}
      />
    </section>
  );
};

export default SearchUser;
