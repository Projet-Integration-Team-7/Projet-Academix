import Image from "next/image"; // Importez Image de Next.js pour l'optimisation des images
import React, { useState, useEffect, useRef } from 'react'; // Importez React et ses hooks
import Select from 'react-select'; // Importez Select de react-select pour les sélecteurs
import { fetchUsers, fetchUser } from "@/lib/actions/user.actions"; // Importez les fonctions pour récupérer les utilisateurs
import axios from 'axios'; // Importez Axios pour les requêtes HTTP
import ProfilePicture from "./ProfilePicture"; // Importez le composant ProfilePicture

// Définissez le type Conversation
type Conversation = {
    _id: string; // ID de la conversation
    name: string; // Nom de la conversation
};

function CreateConversationPage({ userActif }) {
    // Hooks d'état pour gérer les données de l'application
    const [users, setUsers] = useState([]); // Liste des utilisateurs
    const [selectedUsers, setSelectedUsers] = useState([]); // Utilisateurs sélectionnés
    const [conversationName, setConversationName] = useState(''); // Nom de la conversation
    const [conversations, setConversations] = useState<Conversation[]>([]); // Liste des conversations
    const [selectedConversation, setSelectedConversation] = useState(null); // Conversation sélectionnée
    const [loading, setLoading] = useState(false); // État de chargement
    const [error, setError] = useState(null); // Erreur
    const [newMessage, setNewMessage] = useState(''); // Nouveau message
    const [messages, setMessages] = useState([]); // Liste des messages
    const apiURL = 'https://academixbackend-b7d3e8ece074.herokuapp.com/'; // URL de l'API

    // Utilisez useEffect pour charger les données initiales
    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            try {
                // Récupérez la liste des utilisateurs
                const response = await fetchUsers({
                    userId: "user-id-here", // ID de l'utilisateur
                    searchString: "", // Chaîne de recherche
                    pageNumber: 1 // Numéro de page
                });
                if (response && response.users && Array.isArray(response.users)) {
                    // Mettez à jour la liste des utilisateurs
                    setUsers(response.users.map(user => ({ value: user.id, label: user.name })));
                } else {
                    setError('Format de données inattendu');
                }
            } catch (error) {
                setError(`Erreur lors du chargement des données: ${error.message || 'Erreur inconnue'}`);
            }
            setLoading(false);
        }

        fetchInitialData();
    }, []);

    // Utilisez useEffect pour charger les conversations de l'utilisateur en cours
    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                // Récupérez toutes les conversations de l'utilisateur
                const fetchedConversations = await fetchAllUserConversations(apiURL, userActif.id);
                // Mettez à jour la liste des conversations
                setConversations(fetchedConversations);
            } catch (error) {
                setError(`Erreur lors de la récupération des conversations: ${error.message || 'Erreur inconnue'}`);
            }
        }, 1000); // Récupérez toutes les 1 seconde

        return () => clearInterval(intervalId); // Nettoyez l'intervalle lors du démontage du composant
    }, [apiURL, userActif.id]);

    // Utilisez useEffect pour charger les messages de la conversation sélectionnée
    useEffect(() => {
        const fetchConversationMessages = async () => {
            try {
                if (selectedConversation) {
                    // Récupérez les messages de la conversation
                    const messages = await fetchMessages(apiURL, selectedConversation._id);
                    // Mettez à jour la liste des messages
                    setMessages(messages);
                    setError(null);
                }
            } catch (error) {
                setError(`Erreur lors de la récupération des messages: ${error.message || 'Erreur inconnue'}`);
            }
        };

        fetchConversationMessages();

        const intervalId = setInterval(fetchConversationMessages, 1000); // Récupérez toutes les 1 seconde

        return () => clearInterval(intervalId); // Nettoyez l'intervalle lors du démontage du composant
    }, [apiURL, selectedConversation]);

    // Fonction pour récupérer les messages d'une conversation depuis l'API
    const fetchMessages = async (apiURL, conversationId) => {
        try {
            // Effectuez une requête GET pour récupérer les messages
            const response = await axios.get(`${apiURL}getMessages/${conversationId}`);
            return response.data.messages; // Renvoie les messages
        } catch (error) {
            throw new Error(`Impossible de récupérer les messages: ${error.message}`);
        }
    };

    // Fonction pour récupérer toutes les conversations de l'utilisateur depuis l'API
    const fetchAllUserConversations = async (apiURL, userId) => {
        try {
            // Effectuez une requête GET pour récupérer les conversations
            const response = await axios.get(`${apiURL}getConversations/${userId}`);
            if (response.data && response.data.conversations) {
                return response.data.conversations.map(conv => ({ _id: conv.id, name: conv.name }));
            } else {
                throw new Error('Format de données inattendu pour les conversations');
            }
        } catch (error) {
            throw new Error(`Impossible de récupérer les conversations: ${error.message}`);
        }
    };

    // Gérez le changement des utilisateurs sélectionnés
    const handleUserChange = (selectedOptions) => {
        setSelectedUsers(selectedOptions);
        const names = selectedOptions.map(option => option.label).join(', ');
        setConversationName(names + "," + userActif.name);
    };

    // Gérez le changement du nom de la conversation
    const handleNameChange = event => {
        setConversationName(event.target.value);
    };

    // Gérez la sélection d'une conversation
    const handleConversationSelect = conversationId => {
        const conversation = conversations.find(c => c._id === conversationId);
        setSelectedConversation(conversation);
    };

    // Gérez la soumission du formulaire pour créer une conversation
    const handleSubmit = async event => {
        event.preventDefault();
        if (!conversationName || selectedUsers.length === 0) {
            setError('Veuillez fournir un nom de conversation et sélectionner au moins un participant.');
            return;
        }

        setLoading(true);
        const participantIds = [...selectedUsers.map(user => user.value.toString()), userActif.id.toString()];
        try {
            // Créez une nouvelle conversation
            const response = await axios.post(`${apiURL}createConversation`, {
                name: conversationName,
                participants: participantIds
            });
            setError(null);
            console.log(response.data);
        } catch (error) {
            setError(`Impossible de créer la conversation: ${error.message}`);
        }
        setLoading(false);
    };

    // Gérez l'envoi d'un nouveau message dans la conversation sélectionnée
    const handleSendMessage = async () => {
        if (!selectedConversation || !newMessage.trim()) {
            setError('Aucune conversation sélectionnée ou le message est vide');
            return;
        }

        setLoading(true);
        try {
            // Envoyez le message au serveur
            await axios.post(`${apiURL}sendMessages/${selectedConversation._id}/${userActif.name}`, {
                message_text: newMessage
            });

            // Effacez l'entrée du nouveau message et l'erreur
            setNewMessage('');
            setError(null);

        } catch (error) {
            setError(`Impossible d'envoyer le message: ${error.message}`);
        }
        setLoading(false);
    };

    // Gérez le changement du nouveau message
    const handleNewMessageChange = event => {
        setNewMessage(event.target.value);
    };

    // Rendu des messages de la conversation sélectionnée
    const renderConversationMessages = () => {
        if (!selectedConversation) return <p>Sélectionnez une conversation pour voir les messages.</p>;

        return (
            <div className="p-4 shadow rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-emerald-50">Messages de: {selectedConversation.name}</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.user_id === userActif.name ? 'justify-end' : 'justify-start'}`}>
                        <div className="p-2 border rounded-lg">
                            <div className="flex items-center">
                                <p className="font-bold text-white">{msg.user_id}</p>
                            </div>
                            <p className="text-white">{msg.text}</p>
                            <p className="text-white text-sm">{new Date(msg.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
                </div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    placeholder="Saisissez votre message ici"
                    className="mt-4 p-2 border rounded w-full"
                />
                <button onClick={handleSendMessage} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Envoyer</button>
            </div>
        );
    };
    
    // Rendu du composant
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4 text-white">Créer une conversation </h1>
            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    type="text"
                    id="conversationName"
                    placeholder="Nom de la conversation"
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

export default CreateConversationPage; // Exportez le composant CreateConversationPage
