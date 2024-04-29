import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    name: {  // Ajout du champ nom
      type: String,
      required: true,
      default: 'New Conversation'
    },
    participants: [{
      type: String,
      ref: 'User',
      required: true,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Conversation = mongoose.model('Conversation', conversationSchema);
  export default Conversation;
  