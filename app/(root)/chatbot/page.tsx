"use client"
import React from 'react'
import AIAssistant from '../../../components/chatbot/AIAssistant'
import { usePathname } from 'next/navigation';

function Chatbot() {
  const pathname = usePathname();

  if (pathname === '/chatbot') {
    return <AIAssistant />
  } else {
    return null; // Render nothing if the path is not /chatbot
  }
}

export default Chatbot;
