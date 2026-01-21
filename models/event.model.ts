const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  minPlayers: {
    type: Number,
    required: true,
    min: 1
  },
  maxPlayers: {
    type: Number,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['ON_STAGE', 'OFF_STAGE', 'CULTURALS'],
    uppercase: true
  }
}, { timestamps: true });

// Using 'EventModel' prevents the "redeclare" error
const EventModel = mongoose.model('Event', EventSchema);

module.exports = EventModel;