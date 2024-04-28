// apiService.ts

import axios from 'axios';

const baseURL = 'http://localhost:3000/api'; // Votre URL API

export async function sendMessage(conversationId: string, message: string) {
  try {
    const response = await axios.post(`${baseURL}/sendMessage`, {
      conversationId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Error sending message');
  }
}

export async function createConversation(name: string) {
  try {
    const response = await axios.post(`${baseURL}/createConversation`, { name });
    return response.data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw new Error('Error creating conversation');
  }
}

export async function addUser(conversationId: string, userId: string) {
  try {
    const response = await axios.post(`${baseURL}/addUser`, { conversationId, userId });
    return response.data;
  } catch (error) {
    console.error('Error adding user to conversation:', error);
    throw new Error('Error adding user to conversation');
  }
}

export async function userLeft(conversationId: string, userId: string) {
  try {
    const response = await axios.post(`${baseURL}/userLeft`, { conversationId, userId });
    return response.data;
  } catch (error) {
    console.error('Error removing user from conversation:', error);
    throw new Error('Error removing user from conversation');
  }
}
