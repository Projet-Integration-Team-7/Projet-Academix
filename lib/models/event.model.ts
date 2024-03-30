import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;