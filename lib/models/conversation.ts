import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  sender: string;
  text: string;
}

export interface IParticipant {
  userId: string;
}

export interface IConversation extends Document {
  name: string;
  participants: IParticipant[];
  messages: IMessage[];
}

interface IConversationModel extends mongoose.Model<IConversation> {
  createConversation(name: string, participants: IParticipant[], messages: IMessage[]): Promise<IConversation>;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: String, required: true },
  text: { type: String, required: true },
});

const participantSchema = new Schema<IParticipant>({
  userId: { type: String, required: true },
});

const conversationSchema = new Schema<IConversation>({
  name: { type: String, required: true },
  participants: [participantSchema],
  messages: [messageSchema],
});

conversationSchema.statics.createConversation = async function(name: string, participants: IParticipant[], messages: IMessage[]) {
  const conversation = new this({ name, participants, messages });
  return conversation.save();
};

const Conversation = mongoose.model<IConversation, IConversationModel>('Conversation', conversationSchema);

export default Conversation;
