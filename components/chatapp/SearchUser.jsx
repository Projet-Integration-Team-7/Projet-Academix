import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import { fetchUsers } from "@/lib/actions/user.actions";


const SearchUser = ({ searchParams }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useClerk();

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
      <div className='mt-14 flex flex-col gap-9'>
        {users.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          users.map(person => (
            <UserCard
              key={person.id}
              id={person.id}
              name={person.name}
              username={person.username}
              imgUrl={person.image}
              personType='User'
            />
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
