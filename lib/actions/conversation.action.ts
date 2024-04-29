 "use server"

import Conversation from '../models/conversation.model';
import { connectToDB } from "../mongoose";
interface Params {
    name:string;
    participants:string[];
    createdAt:Date;
    updatedAt:Date;
  }
export async function createConversation(name: any, participants: any) {
    console.error('mierdas');
    try {
      connectToDB();
      const newConversation = new Conversation({ name, participants });
      await newConversation.save();
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
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
}
