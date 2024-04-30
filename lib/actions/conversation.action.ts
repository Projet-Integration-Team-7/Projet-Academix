 "use server"

 import UserCard from "@/components/cards/UserCard";
import Conversation from '../models/conversation.model';
import mongoose from 'mongoose'
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
interface Params {
    name:string;
    participants:string[];
    createdAt:Date;
    updatedAt:Date;
  }
export async function createConversation(name: string, participants: string[]) {
    console.error('mierdas');
    try {
      connectToDB();
      const newConversation = new Conversation({ name, participants, createdAt: new Date(), updatedAt: new Date() });
      await newConversation.save();
      return newConversation;
    } catch (error ) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
 /* export async function sendMessage(conversationId: string, message: string) {
    try {
        connectToDB();
        const conversation = await Conversation.findById(conversationId) as IConversation;
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        conversation.messages.push({
          text: message,
          sender: ''
        });
        await conversation.save();
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}*/

/*export async function addUser(conversationId: string, userId: string) {
    try {
        connectToDB();
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        conversation.participants.push(userId);
        await conversation.save();
    } catch (error) {
        console.error('Error adding user to chat:', error);
        throw error;
    }
}

/*export async function userLeft(conversationId: string, userId: string) {
    try {
        connectToDB();
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        conversation.participants = conversation.participants.filter(id => id !== userId);
        await conversation.save();
    } catch (error) {
        console.error('Error removing user from chat:', error);
        throw error;
    }
}
export async function getConversation(conversationId:any) {
  try {
    connectToDB();
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'name');  // Simplifiez cette ligne pour ne récupérer que les informations des participants
    return conversation;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}*/
