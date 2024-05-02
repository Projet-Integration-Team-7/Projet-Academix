// ChatList.jsx
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import './ChatList.css'; 
import {getConversations} from '../../lib/actions/conversation.action'; 

const ChatList = ({ selectChat }) => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const userid = user.id;
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversations = await getConversations(userid.toString()); 
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




