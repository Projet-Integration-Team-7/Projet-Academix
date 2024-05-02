"use client"
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import './ChatList.css'; 
import axios from 'axios';
import {getConversations} from '../../lib/actions/conversation.action'; 
const APIURL = 'http://localhost:5000/';


const ChatList = ({ selectChat }) => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);

  
  const userid = user.id.toString();
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${APIURL}getConversations/${userid}`);
        const conversations = response.data.map(conversation => ({
          id: conversation._id.toString(),
          name: conversation.name
        }));
        setChats(conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [user.id]); 

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div key={chat._id} className="chat-list-item" onClick={() => selectChat(chat._id)}>
          {chat.name}
        </div>
      ))}
    </div>
  );
};

export default ChatList;




