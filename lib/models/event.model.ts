import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  /*eventId: {
    type: Number, // Champ pour stocker le numéro unique de l'événement
    required: true,
    unique: true, // Assurez-vous que chaque numéro d'événement est unique
  },*/
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  allDay: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: '#3788d8',
  },
  
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;