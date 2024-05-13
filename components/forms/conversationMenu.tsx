"use client"
import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { fetchUsers, fetchUser } from "@/lib/actions/user.actions";
import axios from 'axios';




type Conversation = {
    _id: string;
    name: string;
  };

function CreateConversationPage({ userActif }) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [conversationName, setConversationName] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const apiURL = 'https://academixbackend-b7d3e8ece074.herokuapp.com/';
    

    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            try {
                const response = await fetchUsers({
                    userId: "user-id-here",
                    searchString: "",
                    pageNumber: 1
                });
                if (response && response.users && Array.isArray(response.users)) {
                    setUsers(response.users.map(user => ({ value: user.id, label: user.name })));
                } else {
                    setError('Unexpected data format');
                }
            } catch (error) {
                setError(`Error loading data: ${error.message || 'Unknown error'}`);
            }
            setLoading(false);
        }

        fetchInitialData();
    }, []);
    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                const fetchedConversations = await fetchAllUserConversations(apiURL, userActif.id);
                setConversations(fetchedConversations);
            } catch (error) {
                setError(`Error fetching conversations: ${error.message || 'Unknown error'}`);
            }
        }, 1000); // Fetch every 1 second

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, [apiURL, userActif.id]);

    useEffect(() => {
        const fetchConversationMessages = async () => {
            try {
                if (selectedConversation) {
                    const messages = await fetchMessages(apiURL, selectedConversation._id);
                    setMessages(messages);
                    setError(null);
                }
            } catch (error) {
                setError(`Error fetching messages: ${error.message || 'Unknown error'}`);
            }
        };

        fetchConversationMessages();

        const intervalId = setInterval(fetchConversationMessages, 1000); // Fetch every 1 second

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, [apiURL, selectedConversation]);

    const fetchMessages = async (apiURL, conversationId) => {
        try {
            const response = await axios.get(`${apiURL}getMessages/${conversationId}`);
            return response.data.messages;
        } catch (error) {
            throw new Error(`Failed to fetch messages: ${error.message}`);
        }
    };

    const fetchAllUserConversations = async (apiURL, userId) => {
        try {
            const response = await axios.get(`${apiURL}getConversations/${userId}`);
            if (response.data && response.data.conversations) {
                return response.data.conversations.map(conv => ({ _id: conv.id, name: conv.name }));
            } else {
                throw new Error('Unexpected data format for conversations');
            }
        } catch (error) {
            throw new Error(`Failed to fetch conversations: ${error.message}`);
        }
    };

    const handleUserChange = (selectedOptions) => {
        setSelectedUsers(selectedOptions);
        const names = selectedOptions.map(option => option.label).join(', ');
        setConversationName(names);
    };

    const handleNameChange = event => {
        setConversationName(event.target.value);
    };

    const handleConversationSelect = conversationId => {
        const conversation = conversations.find(c => c._id === conversationId);
        setSelectedConversation(conversation);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (!conversationName || selectedUsers.length === 0) {
            setError('Please provide a conversation name and select at least one participant.');
            return;
        }

        setLoading(true);
        const participantIds = [...selectedUsers.map(user => user.value.toString()), userActif.name.toString()];
        try {
            //create conversation
            const response = await axios.post(`${apiURL}createConversation`, {
                name: conversationName,
                participants: participantIds
            });
            setError(null);
            console.log(response.data);
        } catch (error) {
            setError(`Failed to create conversation: ${error.message}`);
        }
        setLoading(false);
    };

    const handleSendMessage = async () => {
        if (!selectedConversation || !newMessage.trim()) {
            setError('No conversation selected or message is empty');
            return;
        }

        setLoading(true);
        try {
            // Send the message to the server
            await axios.post(`${apiURL}sendMessages/${selectedConversation._id}/${userActif.name}`, {
                message_text: newMessage
            });

            // Clear the new message input and error state
            setNewMessage('');
            setError(null);

        } catch (error) {
            setError(`Failed to send message: ${error.message}`);
        }
        setLoading(false);
    };

    const handleNewMessageChange = event => {
        setNewMessage(event.target.value);
    };

    const renderConversationMessages = () => {
        const [usersInfo, setUsersInfo] = useState([]);
    
        useEffect(() => {
            const fetchUsersInfo = async () => {
                const usersData = await Promise.all(messages.map((msg) => fetchUser(msg.user_id)));
                setUsersInfo(usersData);
            };
    
            fetchUsersInfo();
        }, [messages]);
    
        if (!selectedConversation) return <p>Selectionner une conversation por voir le message.</p>;
    
        return (
            <div className="p-4 bg-white shadow rounded-lg overflow-auto">
                <h3 className="text-lg font-bold mb-2">Messages for {selectedConversation.name}</h3>
                {messages.map((msg, index) => {
                    const username = usersInfo[index]?.username;
    
                    return (
                        <div key={msg.id} className="flex justify-between p-2 border-b last:border-b-0">
                            <div>
                                <p className="font-bold">{username}</p>
                                <p>{msg.text}</p>
                            </div>
                            <p>{new Date(msg.createdAt).toLocaleString()}</p>
                        </div>
                    );
                })}
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    placeholder="Type your message here"
                    className="mt-4 p-2 border rounded w-full"
                />
                <button onClick={handleSendMessage} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Send</button>
            </div>
        );
    };
    

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4 texte-white">Créer une conversation </h1>
            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    type="text"
                    id="conversationName"
                    placeholder="Conversation Name"
                    value={conversationName}
                    onChange={handleNameChange}
                    className="p-2 border rounded w-full mb-4"
                />
                <Select
                    options={users}
                    isMulti
                    value={selectedUsers}
                    onChange={handleUserChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">Créer Conversation</button>
            </form>
            <div className="flex gap-4">
                <div className="w-1/3">
                    <div className="bg-white shadow rounded-lg p-4 overflow-auto">
                        <h2 className="text-lg font-bold mb-4">Conversations</h2>
                        <ul>
                            {conversations.map((conversation) => (
                                <li key={conversation._id} onClick={() => handleConversationSelect(conversation._id)} className="p-2 hover:bg-gray-100 cursor-pointer">
                                    {conversation.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="w-2/3">
                    {renderConversationMessages()}
                </div>
            </div>
        </div>
    );
}

export default CreateConversationPage;