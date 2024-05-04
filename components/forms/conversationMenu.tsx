"use client"
import { useState, useEffect } from 'react';
import { fetchConversationsByUser, createConversation, fetchAllConversations, sendConversationMessage } from "@/lib/actions/conversation.action";

export function useConversationManager(userId) {
    const [users, setUsers] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            await loadUsers();
            await loadConversations();
        };
        init();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const result = await fetchUsers({ userId });
            setUsers(result.users.map(user => ({ value: user.id, label: user.name })));
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setError('Failed to fetch users');
        }
        setLoading(false);
    };

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

    const createNewConversation = async (conversationName, participantIds) => {
        setLoading(true);
        try {
            await createConversation(conversationName, participantIds);
        } catch (error) {
            console.error('Failed to create conversation:', error);
            setError('Failed to create conversation');
        }
        setLoading(false);
    };

    const sendMessage = async (conversationId, message) => {
        setLoading(true);
        try {
            await sendConversationMessage(conversationId, message);
        } catch (error) {
            console.error('Failed to send message:', error);
            setError('Failed to send message');
        }
        setLoading(false);
    };

    return { users, conversations, createNewConversation, sendMessage, loading, error };
}
