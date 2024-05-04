 "use server"

 import UserCard from "@/components/cards/UserCard";
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
      console.error('Error creating conversation:', error);
      throw error;
  }
}
  export async function getConversation(name: string) {
    try {
        await connectToDB();
        const conversation = await Conversation.findOne({ name: name });
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        return conversation;
    } catch (error) {
        console.error('Error getting conversation:', error);
        throw error;
    }
}

export async function fetchConversationsByUser(userId: string) {
  try {
      await connectToDB();
      console.log(`Connecting to DB and fetching conversations for user: ${userId}`);
      const conversations = await Conversation.find({ participants: userId });
      console.log(`Fetched conversations:`, conversations);
      if (!conversations || conversations.length === 0) {
          throw new Error('No conversations found for the user');
      }
      return conversations;
  } catch (error) {
      console.error('Error fetching conversations for user:', error);
      throw error;
  }
}
export async function fetchAllConversations() {
  try {
      await connectToDB();
      const conversations = await Conversation.find({});
      return conversations;
  } catch (error) {
      console.error('Error fetching all conversations:', error);
      throw error;
  }
}
export async function sendConversationMessage(conversationId: string, sender: string, text: string) {
  console.log('Posting message:', text);
  try {
    await connectToDB();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    const newMessage = `${sender}: ${text}`;
    // Ajoutez le message directement à la liste des messages de la conversation
    conversation.messages.push(newMessage);
    await conversation.save();
    return text; // Retourne simplement le texte du message
  } catch (error) {
    console.error('Error posting message:', error);
    throw error;
  }
}


export async function getMessages(conversationId: string) {
  try {
    await connectToDB();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return conversation.messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
}
   