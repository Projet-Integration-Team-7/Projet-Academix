"use client"
import React from 'react'
import ChatApp from '../../../components/chatapp/Chat'
import { usePathname } from 'next/navigation';

function Chat() {
  const pathname = usePathname();

  if (pathname === '/chat') {
    return <ChatApp />
  } else {
    return null; // retourne rien sur path n'est pas /chat
  }
  }


export default Chat;