// models/Conversation.ts
import mongoose, { Document } from 'mongoose';

export interface IMessage {
  sender: string;
  text: string;
}

export interface IConversation extends Document {
  name: string;
  messages: IMessage[];
}

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
});

const conversationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  messages: [messageSchema],
});

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
