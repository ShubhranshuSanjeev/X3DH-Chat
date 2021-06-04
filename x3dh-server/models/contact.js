const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  initialMessage: {
    type: Object
  },
  x3dhProtocolStatus: {
    recieverSuccess: {
      type: Boolean,
      default: false,
    },
    senderSuccess: {
      type: Boolean,
      default: false,
    },
    initiator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  chatHistory: {
    messages: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          auto: true,
        },
        sender: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
        },
        text: {
          type: String,
          required: true,
        }
      }
    ]
  }
});

module.exports = mongoose.model('Contact', contactSchema);