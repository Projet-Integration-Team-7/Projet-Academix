"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { fetchUsers } from "@/lib/actions/user.actions";
import{createConversation} from "@/lib/actions/conversation.action";
import { currentUser, useUser } from '@clerk/nextjs';
const APIURL = 'http://localhost:5000/';
// les users selectionnes
interface SelectedUser {
    value: string; 
    label: string;
}

const CreateConversationPage = () => {
    const [users, setUsers] = useState<Array<{ value: string; label: string }>>([]);
    const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
    const [conversationName, setConversationName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!conversationName || selectedUsers.length === 0) {
            console.log('Please provide a conversation name and select at least one participant.');
            return;
        }

        setLoading(true);

        try {
            const participantIds =selectedUsers.map(user => user.value);
            console.log(conversationName)
            console.log(participantIds)
            const response = await axios.post(`${APIURL}createConversation`, {
                name: conversationName,
                participants: participantIds
            });
            console.log('Conversation created:', response.data);
        } catch (error) {
            console.error('Failed to create conversation:', error);
            setError('Failed to create conversation');
        }

        
        setLoading(false);
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
        </div>
    );
};

export default CreateConversationPage;