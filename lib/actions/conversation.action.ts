"use server"
import Conversation from '../models/conversation.model';
import mongoose from 'mongoose'
import { connectToDB } from "../mongoose";
import User from "../models/user.model";

interface Message {
  sender: string;
  text: string;
  timestamp: Date;
}

interface Params {
  name: string;
  participants: string[];
  messages: string[]; 
  createdAt: Date;
  updatedAt: Date;
  // Ajoutez cette ligne
}

/**
 * Crée une nouvelle conversation avec le nom, les participants et les messages donnés.
 * @param name Le nom de la conversation
 * @param participants Les participants de la conversation
 * @param messages Les messages de la conversation
 * @returns La nouvelle conversation créée
 */
export async function createConversation(name: string, participants: string[], messages: string[]) {
  try {
      connectToDB();
      const newConversation = new Conversation({ 
          name, 
          participants, 
          messages, 
          createdAt: new Date(), 
          updatedAt: new Date() 
      });
      await newConversation.save();
      return newConversation;
  } catch (error) {
      console.error('Erreur lors de la création de la conversation :', error);
      throw error;
  }
}

/**
 * Récupère une conversation en fonction de son nom.
 * @param name Le nom de la conversation à récupérer
 * @returns La conversation correspondante
 */
export async function getConversation(name: string) {
  try {
      await connectToDB();
      const conversation = await Conversation.findOne({ name: name });
      if (!conversation) {
          throw new Error('Conversation introuvable');
      }
      return conversation;
  } catch (error) {
      console.error('Erreur lors de la récupération de la conversation :', error);
      throw error;
  }
}

/**
 * Récupère toutes les conversations d'un utilisateur en fonction de son identifiant.
 * @param userId L'identifiant de l'utilisateur
 * @returns Les conversations de l'utilisateur
 */
export async function fetchConversationsByUser(userId: string) {
  try {
      await connectToDB();
      console.log(`Connexion à la base de données et récupération des conversations pour l'utilisateur : ${userId}`);
      const conversations = await Conversation.find({ participants: userId });
      console.log(`Conversations récupérées :`, conversations);
      if (!conversations || conversations.length === 0) {
          throw new Error('Aucune conversation trouvée pour l\'utilisateur');
      }
      return conversations;
  } catch (error) {
      console.error('Erreur lors de la récupération des conversations pour l\'utilisateur :', error);
      throw error;
  }
}

/**
 * Récupère toutes les conversations.
 * @returns Toutes les conversations
 */
export async function fetchAllConversations() {
  try {
      await connectToDB();
      const conversations = await Conversation.find({});
      return conversations;
  } catch (error) {
      console.error('Erreur lors de la récupération de toutes les conversations :', error);
      throw error;
  }
}

/**
 * Envoie un message dans une conversation spécifiée.
 * @param conversationId L'identifiant de la conversation
 * @param sender L'expéditeur du message
 * @param text Le texte du message
 * @returns Le texte du message envoyé
 */
export async function sendConversationMessage(conversationId: string, sender: string, text: string) {
  console.log('Envoi du message :', text);
  try {
    await connectToDB();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation introuvable');
    }
    const newMessage = `${sender}: ${text}`;
    // Ajoutez le message directement à la liste des messages de la conversation
    conversation.messages.push(newMessage);
    await conversation.save();
    return text; // Retourne simplement le texte du message
  } catch (error) {
    console.error('Erreur lors de l'envoi du message :', error);
    throw error;
  }
}

/**
 * Récupère tous les messages d'une conversation spécifiée.
 * @param conversationId L'identifiant de la conversation
 * @returns Les messages de la conversation
 */
export async function getMessages(conversationId: string) {
  try {
    await connectToDB();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation introuvable');
    }
    return conversation.messages;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error);
    throw error;
  }
}
