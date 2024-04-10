import React from 'react'
// app/auth/messages/page.tsx (before moving chat_app)
import { ClerkProvider } from "@clerk/clerk-react";
import Chat from '@/components/chat/chat';
import { currentUser } from '@clerk/nextjs';
import { createChatUserSecret } from '@/lib/utils';


const Message = async () => {

  const user = await currentUser();
  if (!user) return null;

  console.log("current user", user.id);

  return (
    <Chat
      userName={user?.username}
      userSecret={createChatUserSecret(user?.id)}
    />
  )
}

export default Message