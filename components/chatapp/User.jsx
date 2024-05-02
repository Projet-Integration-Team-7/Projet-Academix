"use client"
import React from 'react';
import { useUser } from '@clerk/clerk-react'; 

const User = () => {
  const { user } = useUser();

  return (
    <div className="user">
      <img src={user.avatarUrl} alt={user.fullName} />
      <div>{user.fullName}</div>
    </div>
  );
};

export default User;

