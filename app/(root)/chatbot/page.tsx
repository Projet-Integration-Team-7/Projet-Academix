"use client"
import React from 'react'
import AIAssistant from '../../../components/chatbot/AIAssistant'
import { usePathname } from 'next/navigation';

function Chatbot() {
  const pathname = usePathname();

  if (pathname === '/chatbot') {
    return <AIAssistant />
  } else {
    return null; // retourne rien sur path n'est pas /chat
  }
  }


export default Chatbot;
