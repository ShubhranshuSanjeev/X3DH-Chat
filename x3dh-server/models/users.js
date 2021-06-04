const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  connectionRequests: {
    users: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          auto: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  keyBundle: {
    identityKey: {
      type: String,
    },
    preKeyBundle: [
      {
        _id : {
          type: String,
        },
        prekey: {
          type: String,
        }
      }
    ]
  }
});

userSchema.methods.addConnectionRequest = async function (user) {
  try{
    const exsistingConnectionRequest = this.connectionRequests.users.find(
      (request) => request.userId.toString() === user._id.toString()
    );
    if (!exsistingConnectionRequest) {
      this.connectionRequests.users.push({ userId: user._id });
      return await this.save();
    }
    return null;
  }
  catch(err) {
    console.log(err);

    const error = new Error("Unable to perform action. Try again later");
    error.statusCode = 500;
    throw error;
  }
};

userSchema.methods.changeRequestStatus = async function (otherUser, requestStatus, idx) {
  try{
    if(requestStatus === 'accept'){
      this.contacts.users.push({ userId: otherUser._id });
      otherUser.contacts.users.push({ userId: this._id });
      await otherUser.save();
    }
    this.connectionRequests.users.splice(idx, 1);
    return this.save();

  } catch(err) {
    console.log(err);
    const error = new Error("Unable to perform action. Try again later");
    error.statusCode = 500;
    throw error;
  }
}

userSchema.methods.saveIdentityKey = function (identityKey) {
  try{
    this.keyBundle.identityKey = JSON.stringify(identityKey.publicIdKeyJWK);
    return this.save();
  } catch(err) {
    console.log(err);
    const error = new Error("Unable to perform action. Try again later");
    error.statusCode = 500;
    throw error;
  }
}

userSchema.methods.savePreKeyBundle = function (preKeyBundle) {
  try{
    const bundle = [];
    for(const key in preKeyBundle){
      bundle.push({
        _id: key,
        prekey: JSON.stringify(preKeyBundle[key].publicKeyJWK)
      });
    }
    this.keyBundle.preKeyBundle = bundle;
    return this.save();
  } catch(err) {
    console.log(err);
    const error = new Error("Unable to perform action. Try again later");
    error.statusCode = 500;
    throw error;
  }
}

module.exports = mongoose.model("User", userSchema);
