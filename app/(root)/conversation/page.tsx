"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { fetchUsers } from "@/lib/actions/user.actions";
import{createConversation,fetchAllConversations ,sendConversationMessage } from "@/lib/actions/conversation.action";
import { currentUser } from '@clerk/nextjs';
// les users selectionnes
interface SelectedUser {
    value: string; 
    label: string;
}

const CreateConversationPage = () => {const [users, setUsers] = useState<Array<{ value: string; label: string }>>([]);
const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
const [conversationName, setConversationName] = useState('');
const [conversations, setConversations] = useState([]); // État pour stocker les conversations
const [selectedConversation, setSelectedConversation] = useState(null); // État pour la conversation sélectionnée
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [newMessage, setNewMessage] = useState('');
const user=currentUser;

    const userId = "user-id-here"; // Cet ID devrait être dynamique ou récupéré par l'authentification
    useEffect(() => {
        const loadConversations = async () => {
            setLoading(true);
            try {
                const fetchedConversations = await fetchAllConversations();
                setConversations(fetchedConversations);
            } catch (error) {
                console.error('Failed to load conversations:', error);
                setError('Failed to load conversations');
            }
            setLoading(false);
        };

        loadConversations();
    }, []);
    // actualise la liste des utilisateurs
    useEffect(() => {
        const fetchUsersData = async () => {
            setLoading(true);
            try {
                const result = await fetchUsers({
                    userId: "user-id-here", //  l'identifiant de l'utilisateur
                    searchString: "",       // la recherche de l'utilisateur
                    pageNumber: 1           // le nombre de la page
                });
                if (result) {
                    setUsers(result.users.map(user => ({ value: user.id, label: user.name })));
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setError('Failed to fetch users');
            }
            setLoading(false);
        };

        fetchUsersData();
    }, []);
    const handleUserChange = (selectedOptions: SelectedUser[]) => {
        setSelectedUsers(selectedOptions);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConversationName(event.target.value);
    };
    const handleConversationSelect = (conversationId) => {
        const conversation = conversations.find(c => c._id === conversationId);
        setSelectedConversation(conversation);
    };

    

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!conversationName || selectedUsers.length === 0) {
            console.log('Please provide a conversation name and select at least one participant.');
            return;
        }

        setLoading(true);
        
            const participantIds = selectedUsers.map(user => user.value);
            const response = await createConversation( conversationName,  participantIds );
            
        
        setLoading(false);
    };
    const handleSendMessage = async () => {
        if (!selectedConversation || !newMessage.trim()) {
            console.error('No conversation selected or message is empty');
            return;
        }
        console.log('Posting message:', newMessage);
        try {
            setLoading(true);
            await sendConversationMessage(selectedConversation._id, userId, newMessage);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
            setError('Failed to send message');
        }
        setLoading(false);
    };

    const handleNewMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.target.value);
    };

    const renderConversationMessages = () => {
        if (!selectedConversation) return <p>Select a conversation to view messages.</p>;
        return (
            <div>
                <h3>Messages for {selectedConversation.name}</h3>
                {selectedConversation && selectedConversation.messages && selectedConversation.messages.map((message, index) => (
                    <p key={index}>{message}</p> // Modification ici
                ))}
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    placeholder="Type your message here"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Create New Conversation</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="conversationName" className="block mb-2 text-sm font-medium text-gray-900">Conversation Name</label>
                    <input
                        type="text"
                        id="conversationName"
                        value={conversationName}
                        onChange={handleNameChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    />
                </div>
                <div className="mb-3">
                    <Select
                        options={users}
                        isMulti
                        value={selectedUsers}
                        onChange={handleUserChange}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>
                <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create Conversation</button>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
            </form>
            <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Create New Conversation</h1>
            <form onSubmit={handleSubmit}>
                {/* Input fields and buttons */}
            </form>
            <div>
                <h2 className="text-xl font-bold mb-4">Conversations</h2>
                <ul>
                    {conversations.map((conversation) => (
                        <li key={conversation._id} onClick={() => handleConversationSelect(conversation._id)}>
                            {conversation.name}
                        </li>
                    ))}
                </ul>
                {renderConversationMessages()}
            </div>
        </div>
        
        </div>
        
    );
};

export default CreateConversationPage;