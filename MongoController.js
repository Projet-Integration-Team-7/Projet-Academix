const Conversation = require('./models/conversation');

const getConversations = async () => {
  try {
    const conversations = await Conversation.find();
    return conversations;
  } catch (err) {
    throw new Error(err.message);
  }
};

const createConversation = async (name, userId) => {
  try {
    const conversation = new Conversation({
      name,
      participants: [{ userId }],
      messages: []
    });

    const newConversation = await conversation.save();
    return newConversation;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getConversations,
  createConversation
};
