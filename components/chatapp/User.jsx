"use client"
import React from 'react';
import { useUser } from '@clerk/clerk-react'; // Assuming you are using Clerk's React SDK

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

