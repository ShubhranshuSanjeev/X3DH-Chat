const ObjectId = require('mongodb').ObjectID;
const User = require('../models/users');
const Contact = require('../models/contact');
const UserSerializer = require('../serializers/users').UserSerializer;

const postIdentityKey = async (req, res, next) => {
  try{
    const result = req.user.saveIdentityKey(req.body.idenityKey);
    let response;
    if(result) {
      res.status(200).json({});
    } else {
      console.log(err);
      const error = new Error("Unable to perform action. Try again later");
      error.statusCode = 500;
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const postPreKeyBundle = async (req, res, next) => {
  try{
    const result = req.user.savePreKeyBundle(req.body.prekeyBundle);
    let response;
    if(result) {
      res.status(200).json({});
    } else {
      console.log(err);
      const error = new Error("Unable to perform action. Try again later");
      error.statusCode = 500;
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getKeyBundle = async (req, res, next) => {
  try{
    const userId = new ObjectId(req.params.userId);
    const contactDoc = await await Contact.findOne({
      $or: [
        { $and: [{ user1: req.user._id }, { user2: userId }] },
        { $and: [{ user2: req.user._id }, { user1: userId }] },
      ],
    });
    if(contactDoc) {
      const otherUser = await User.findById(userId);
      const userObject = otherUser.toObject();
      const identityKey = userObject.keyBundle.identityKey;
      const prekey = userObject.keyBundle.preKeyBundle[0];

      // userObject.keyBundle.preKeyBundle.splice(0, 1);
      // otherUser.keyBundle.preKeyBundle = userObject.keyBundle.preKeyBundle;
      // const result = await otherUser.save();
      const response = {
        _id: req.params.userId,
        identityKey: identityKey,
        prekey: {
          _id: prekey._id,
          key: prekey.prekey,
        }
      }
      console.log(response);
      res.status(200).json(response);
    } else {
      const error = new Error("Cannot find any such contact");
      error.statusCode = 500;
      throw error;
    }
  } catch(error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const postInitialMessage = async (req, res, next) => {
  try {
    const { sentFor } = req.body;
    const userId = new ObjectId(sentFor);
    const contact = await Contact.findOne({
      $or: [
        { $and: [{ user1: req.user._id }, { user2: userId }] },
        { $and: [{ user2: req.user._id }, { user1: userId }] },
      ],
    });

    if(contact){
      contact.initialMessage = { ...req.body }
      contact.x3dhProtocolStatus = { recieverSuccess: false, senderSuccess: false, initiator:req.user._id };
      const result = await contact.save();
      if(result) {
        res.status(200).json({});
      } else {
        console.log(err);
        const error = new Error("Unable to perform action. Try again later");
        error.statusCode = 500;
        throw error;
      }
    } else {
      const error = new Error("Cannot find any such contact");
      error.statusCode = 500;
      throw error;
    }
    console.log(req.body);
  } catch(error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getInitialMessages = async (req, res, next) => {
  try {
    const contact = await Contact.find({
      $or: [ { user1: req.user._id }, { user2: req.user._id } ],
    });
    if(contact){
      // console.log(c)
      const initialMessages = {};
      contact.forEach(con => {
        if(con.initialMessage.sentFor){
          console.log(con, con.initialMessage.sentFor, req.user._id.toString());
          if(con.initialMessage.sentFor === req.user._id.toString()){
            console.log(con);
            const key = con.user1.toString() === req.user._id.toString() ? con.user2.toString() : con.user1.toString();
            initialMessages[key] = con.initialMessage;
          }
        }
      });
      res.status(200).json({
        initialMessages
      });
    } else {
      const error = new Error("Cannot find any such contact");
      error.statusCode = 500;
      throw error;
    }
  } catch(error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const deleteInitialMessage = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const contact = await Contact.findOne({
      $or: [
        { $and: [{ user1: req.user._id }, { user2: userId }] },
        { $and: [{ user2: req.user._id }, { user1: userId }] },
      ],
    });

    if(contact){
      const prekeyId = contact.initialMessage.preKeyIdentifier;
      const newBundle = req.user.keyBundle.preKeyBundle.filter((key) => key._id != prekeyId);

      contact.initialMessage = {};
      req.user.keyBundle.preKeyBundle = newBundle;

      await contact.save();
      await req.user.save();

      res.status(200).json({});
    } else {
      const error = new Error("Cannot find any such contact");
      error.statusCode = 500;
      throw error;
    }
  } catch(error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const updateReciverProtocolStatus = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const contact = await Contact.findOne({
      $or: [
        { $and: [{ user1: req.user._id }, { user2: userId }] },
        { $and: [{ user2: req.user._id }, { user1: userId }] },
      ],
    });

    if(contact){
      contact.x3dhProtocolStatus.recieverSuccess = true;
      await contact.save();
      res.status(200).json({});
    } else {
      const error = new Error("Cannot find any such contact");
      error.statusCode = 500;
      throw error;
    }
  } catch(error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getX3DHProtocolStatus = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const contact = await Contact.findOne({
      $or: [
        { $and: [{ user1: req.user._id }, { user2: userId }] },
        { $and: [{ user2: req.user._id }, { user1: userId }] },
      ],
    });

    if(contact){
      const protocolStatus = contact.x3dhProtocolStatus;
      res.status(200).json({
        protocolStatus
      });
    } else {
      const error = new Error("Cannot find any such contact");
      error.statusCode = 500;
      throw error;
    }
  } catch(error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postIdentityKey = postIdentityKey;
exports.postPreKeyBundle = postPreKeyBundle;
exports.getKeyBundle = getKeyBundle;
exports.postInitialMessage = postInitialMessage;
exports.getInitialMessages = getInitialMessages;
exports.deleteInitialMessage = deleteInitialMessage;
exports.updateReciverProtocolStatus = updateReciverProtocolStatus;
exports.getX3DHProtocolStatus = getX3DHProtocolStatus;