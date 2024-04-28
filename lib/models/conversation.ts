import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  sender: string;
  text: string;
}

export interface IConversation extends Document {
  name: string;
  messages: IMessage[];
}

const messageSchema = new Schema<IMessage>({
  sender: { type: String, required: true },
  text: { type: String, required: true },
});

const conversationSchema = new Schema<IConversation>({
  name: { type: String, required: true },
  messages: [messageSchema],
});

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
export const createConversation = async (name: string) => {
  const conversation = new Conversation({ name, messages: [] });
  return conversation.toObject();
};
