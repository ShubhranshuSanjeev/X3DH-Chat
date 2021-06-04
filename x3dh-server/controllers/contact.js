const ObjectId = require("mongodb").ObjectID;

const User = require("../models/users");
const Contact = require("../models/contact");
const UserSerializer = require("../serializers/users").UserSerializer;

const postConnectionRequest = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.body._id);
    const userToConnect = await User.findOne({ _id: userId });
    const hasRequest = req.user.connectionRequests.users.find(
      (user) => user.userId.toString() === userId.toString()
    );
    const alreadyContact = await Contact.findOne({
      $or: [
        { $and: [{ user1: req.user._id }, { user2: userId }] },
        { $and: [{ user2: req.user._id }, { user1: userId }] },
      ],
    });

    console.log('Here', alreadyContact, hasRequest);

    let response;
    if (alreadyContact) {
      response = { message: "This user is already connected to you." };
    } else if (hasRequest || userId.toString() === req.user._id.toString()) {
      response = {
        message: "This user has already sent you a connection request.",
      };
    } else {
      const result = await userToConnect.addConnectionRequest(req.user);
      if (result) {
        response = { message: "Connection Request has been sent." };
      } else {
        response = {
          message: "Request was already sent. Wait for the user to accept.",
        };
      }
    }
    res.status(200).json(response);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getConnectionRequests = async (req, res, next) => {
  try {
    const promises = req.user.connectionRequests.users.map(async (user) => {
      const userObj = await (await User.findById(user.userId)).toObject();
      return {
        _id: user._id,
        user: UserSerializer.getSerializer(userObj).data,
      };
    });
    const connectionRequests = await Promise.all(promises);
    res.status(202).json({
      connectionRequests: connectionRequests,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const acceptOrDeclineRequests = async (req, res, next) => {
  try {
    const requestId = req.params.requestId;
    const requestStatus = req.route.path.split("/")[3];

    const idx = req.user.connectionRequests.users.findIndex(
      (user) => user._id.toString() === requestId
    );
    if (idx === -1) {
      const error = new Error("No such connection request found.");
      error.statusCode = 500;
      next(error);
    }

    const otherUserId = req.user.connectionRequests.users[idx].userId;
    const otherUser = await User.findOne({ _id: otherUserId });

    if (requestStatus === "accept") {
      const contact = new Contact({
        user1: req.user._id,
        user2: otherUser._id,
      });
      await contact.save();
    }

    req.user.connectionRequests.users.splice(idx, 1);
    await req.user.save();

    res.status(200).json({
      message: "Action performed successfully",
    });
  } catch (err) {
    const error = new Error("Unable to perform action. Try again later");
    error.statusCode = 500;
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const contactsDoc = await Contact.find({ $or: [{ user1:req.user._id }, { user2:req.user._id }] });
    const promises = contactsDoc.map(async (contact) => {
      const otherUser = contact.user1.toString() === req.user._id.toString() ? contact.user2 : contact.user1;
      const userObj = await (await User.findById(otherUser)).toObject();
      return {
        _id: otherUser.toString(),
        user: UserSerializer.getSerializer(userObj).data,
      };
    });
    console.log(promises);
    const contacts = await Promise.all(promises);
    res.status(202).json({
      contacts: contacts,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getChat = async (req, res, next) => {
  try{
    const userId = req.params.userId;
    const contactDoc = await await Contact.findOne({
      $or: [
        { $and: [{ user1: req.user._id }, { user2: userId }] },
        { $and: [{ user2: req.user._id }, { user1: userId }] },
      ],
    });
    if(contactDoc) {
      const contact = contactDoc.toObject();
      res.status(200).json({
        _id: userId,
        chat: [ ...contact.chatHistory.messages ]
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

exports.postConnectionRequest = postConnectionRequest;
exports.getConnectionRequests = getConnectionRequests;
exports.acceptOrDeclineRequests = acceptOrDeclineRequests;
exports.getContacts = getContacts;
exports.getChat = getChat;