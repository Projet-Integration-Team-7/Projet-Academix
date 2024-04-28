const express = require('express');
const Conversation = require('../../../lib/models/conversation'); 
const router = express.Router();

// Récupérer toutes les conversations
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Créer une nouvelle conversation
router.post('/', async (req, res) => {
  const conversation = new Conversation({
    participants: req.body.participants,
    messages: []
  });

  try {
    const newConversation = await conversation.save();
    res.status(201).json(newConversation);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un utilisateur d'une conversation
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    const participantIndex = conversation.participants.findIndex(participant => participant.userId === userId);
    if (participantIndex === -1) {
      return res.status(404).json({ message: 'L\'utilisateur ne participe pas à la conversation' });
    }

    conversation.participants.splice(participantIndex, 1);

    await conversation.save();

    res.json({ message: 'L\'utilisateur a quitté la conversation' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

