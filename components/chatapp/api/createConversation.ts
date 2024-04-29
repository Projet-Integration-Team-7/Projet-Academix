import { NextApiRequest, NextApiResponse } from 'next';
import { getConversations, createConversation } from '../../../MongoController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Incoming HTTP request:', req);
  switch (req.method) {
    case 'GET':
      try {
        const conversations = await getConversations();
        res.status(200).json(conversations);
      } catch (err: any) {
        res.status(500).json({ message: err.message });
      }
      break;

    case 'POST':
      const { name } = req.body;
      console.log('Received POST request to create conversation. Name:', name);
      try {
        const newConversation = await createConversation(name);
        console.log('Conversation created:', newConversation);
        res.status(201).json(newConversation);
      } catch (err: any) {
        console.error('Error creating conversation:', err);
        res.status(400).json({ message: err.message });
      }
      break;

  }
}
