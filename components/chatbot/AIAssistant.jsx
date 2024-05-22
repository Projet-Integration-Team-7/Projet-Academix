import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { redirect, usePathname } from 'next/navigation'; // Importation de la fonction de redirection et du hook usePathname depuis la bibliothèque Next.js (assurez-vous d'avoir correctement importé ces dépendances)
import { useUser } from '@clerk/clerk-react'; // Importation du hook useUser depuis la bibliothèque Clerk React (assurez-vous d'avoir correctement importé cette dépendance)
import './AIAssistant.css'; // Importation du fichier de style CSS pour le composant AIAssistant
import FileUpload from './FileUpload'; // Importation du composant FileUpload (assurez-vous d'avoir correctement importé ce composant)

const apiUrlMessage = `https://academixbackend-b7d3e8ece074.herokuapp.com/message`; // URL de la route message

// Fonction pour envoyer une requête à l'API OpenAI
async function sendRequest(prompt, userId) {
  try {
    const response = await axios.post(apiUrlMessage, { id_utilisateur: userId, saisie_utilisateur: prompt }); // Envoi de la requête POST à l'API avec l'ID utilisateur et la saisie utilisateur
    return response.data.message; // Renvoie du message de réponse de l'API
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la requête :', error); // Gestion des erreurs en cas d'échec de la requête
    throw error;
  }
}

const AIAssistant = () => {
  const pathname = usePathname(); // Récupération du chemin d'accès courant à l'aide du hook usePathname
  const [messages, setMessages] = useState([]); // Initialisation de l'état pour stocker les messages
  const [inputMessage, setInputMessage] = useState(''); // Initialisation de l'état pour stocker le message de l'utilisateur
  const { user } = useUser(); // Récupération de l'utilisateur actuel à l'aide du hook useUser

  // Effet pour envoyer un message initial lors du chargement du composant
  useEffect(() => {
    async function sendInitialMessage() {
      if (user) { // Vérification si un utilisateur est connecté
        try {
          const response = await axios.post(apiUrl, { id_utilisateur: user.id, saisie_utilisateur: 'Bonjour' }); // Envoi du message initial "Bonjour" à l'API
          const aiResponse = response.data.message; // Récupération de la réponse de l'API
          setMessages([...messages, { user: false, message: aiResponse }]); // Mise à jour de l'état avec la réponse de l'API
        } catch (error) {
          console.error('Erreur lors de l\'envoi du message initial :', error); // Gestion des erreurs en cas d'échec de l'envoi du message initial
        }
      }
    }

    sendInitialMessage();
  }, []); // Effet dépendant uniquement du chargement initial

  // Fonction pour gérer l'entrée de l'utilisateur
  async function handleUserInput(event) {
    event.preventDefault();
    const userMessage = inputMessage.trim(); // Récupération et suppression des espaces inutiles du message de l'utilisateur
    setMessages([...messages, { user: true, message: userMessage }]); // Mise à jour de l'état avec le message de l'utilisateur
    setInputMessage(''); // Réinitialisation du champ de saisie utilisateur
    const aiResponse = await sendRequest(userMessage, user.id); // Envoi du message de l'utilisateur à l'API et réception de la réponse
    setMessages([...messages, { user: true, message: userMessage }, { user: false, message: aiResponse }]); // Mise à jour de l'état avec le message de l'utilisateur et la réponse de l'API
  }

  // Fonction pour gérer l'appui sur la touche Entrée
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleUserInput(event); // Appel de la fonction de gestion de l'entrée de l'utilisateur
    }
  }

  // Rendu conditionnel du composant en fonction du chemin d'accès
  if (pathname === '/chatbot') { // Si le chemin d'accès est '/chatbot'
    return (
      <div className="ai-assistant-container">
        <div className="ai-assistant-title">Assistant Personnel</div>
        <div className="ai-assistant-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.user ? 'user' : 'ai'}`}>
              <div className="message-title">{msg.user ? 'Vous' : 'Assistant Personnel'}</div>
              {msg.message}
            </div>
          ))}
        </div>
        <div className="ai-assistant-input">
          <div className="input-container">
            <FileUpload /> {/* Intégration du composant FileUpload */}
            <input
              type="text"
              placeholder="Entrez votre question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleKeyPress(e)} // Gestion de l'appui sur la touche Entrée
            />
          </div>
          <button onClick={handleUserInput}></button> {/* Bouton pour envoyer le message de l'utilisateur */}
        </div>
      </div>
    );
  } else {
    return null; // Ne rien afficher si le chemin d'accès n'est pas '/chatbot'
  }
};

export default AIAssistant;
