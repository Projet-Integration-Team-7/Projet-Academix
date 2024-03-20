import React from 'react'
// app/auth/messages/page.tsx (before moving chat_app)
import { ClerkProvider } from "@clerk/clerk-react";
import { App } from "../../../chat_application/src/App";

const Message = () => {
  return (
    <div>
      <h1>Message Route</h1>
      <App />
    </div>
  )
}

export default Message