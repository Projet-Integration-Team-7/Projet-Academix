"use client"
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchUsers } from "@/lib/actions/user.actions";
import { createConversation, fetchAllConversations, sendConversationMessage } from "@/lib/actions/conversation.action";

function CreateConversationPage({ userActif }) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [conversationName, setConversationName] = useState('');
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            try {
                const fetchedConversations = await fetchAllConversations();
                setConversations(fetchedConversations);
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
        const participantIds = selectedUsers.map(user => user.value);
        try {
            await createConversation(conversationName, participantIds);
            setError(null);
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
            await sendConversationMessage(selectedConversation._id, userActif.name, newMessage);
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
        if (!selectedConversation) return <p>Select a conversation to view messages.</p>;
        return (
            <div className="p-4 bg-white shadow rounded-lg overflow-auto">
                <h3 className="text-lg font-bold mb-2">Messages for {selectedConversation.name}</h3>
                {selectedConversation.messages.map((message, index) => (
                    <p key={index} className="p-2 border-b last:border-b-0">{message}</p>
                ))}
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
            <h1 className="text-xl font-bold mb-4">Create New Conversation</h1>
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
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">Create Conversation</button>
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
