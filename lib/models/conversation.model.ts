import mongoose from "mongoose";
// Définition du schéma d'un message
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Définition du schéma d'une conversation
const conversationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "New Conversation",
  },
  participants: [
    {
      type: String,
      ref: "User",
      required: true,
    },
  ],
  messages: [
    {
      type: String,
      ref: "messages",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;
