const bcrypt = require('bcryptjs');
const User = require('../models/users');

class UserSerializer {
  static fields = {
    _id: {required: true},
    email: { required: true },
    username: { required: true },
    firstName: { required: true },
    lastName: { required: true }
  };

  constructor({ _id, username, email, firstName, lastName }){
    this.data = {
      _id: _id,
      username : username,
      email : email,
      firstName : firstName,
      lastName : lastName
    };
  }

  static getSerializer(data){
    for(const field in UserSerializer.fields) {
      const hasField = data.hasOwnProperty(field);
      if(!hasField && UserSerializer.fields[field].required){
        const missingValueError = new Error("Fill all the fields " + field);
        missingValueError.statusCode = 500;
        throw missingValueError;
      }
    }

    return new UserSerializer(data);
  }
}

class UserRegisterSerializer {
  static fields = {
    email: { required: true },
    username: { required: true },
    password: { required: true },
    password2: { required: true },
    firstName: { required: true },
    lastName: { required: true }
  };

  constructor({ email, username, password, password2, firstName, lastName }){
    this.data = {
      email : email,
      username: username,
      password: password,
      password2: password2,
      firstName: firstName,
      lastName: lastName
    };
  }

  static getSerializer(data){
    for(const field in UserRegisterSerializer.fields) {
      const hasField = data.hasOwnProperty(field);
      if(!hasField && UserRegisterSerializer.fields[field].required){
        const missingValueError = new Error(`Fill all the fields: ${field}`);
        missingValueError.statusCode = 500;
        throw missingValueError;
      }
    }

    return new UserRegisterSerializer(data);
  }

  async is_valid(){

    // Check for exisiting user with given username
    const usernameCheck = await User.findOne({ username: this.data.username });
    if(usernameCheck) {
      const error = new Error('Username already exsists');
      error.statusCode = 401;
      throw error;
    }

    // Check for exisiting user with given email
    const emailCheck = await User.findOne({ email: this.data.email });
    if(emailCheck) {
      const error = new Error('Email already exsists');
      error.statusCode = 401;
      throw error;
    }

    if(this.data.password !== this.data.password2){
      const error = new Error("Passwords don't match. Retype the password.");
      error.statusCode = 401;
      throw error;
    }

    if(this.data.password.length < 6) {
      const error = new Error('Password should atleast have 6 characters.');
      error.statusCode = 401;
      throw error;
    }

    return this.data;
  }

  async create(validatedData) {
    const { username, email, password, firstName, lastName } = validatedData;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = new User({
      username: username,
      email: email,
      password: passwordHash,
      firstName: firstName,
      lastName: lastName
    });

    const userInstance = await user.save();
    return userInstance.toObject();
  }
}

class UserLoginSerializer {
  static fields = {
    email: { required: true },
    password: { required: true },
  };

  constructor({ email, password }){
    this.data = {
      email : email,
      password : password
    };
  }

  static getSerializer(data){
    for(const field in UserLoginSerializer.fields) {
      const hasField = data.hasOwnProperty(field);
      if(!hasField && UserLoginSerializer.data[field].required){
        const missingValueError = new Error("Please fill all the fields");
        missingValueError.statusCode = 500;
        throw missingValueError;
      }
    }

    return new UserLoginSerializer(data);
  }

  async is_valid(){
    // console.log(this.em)
    const user = await User.findOne({ email: this.data.email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(this.data.password, user.password);

    if (!isEqual) {
      const error = new Error('Please enter correct password.');
      error.statusCode = 401;
      throw error;
    }
    return user.toObject();
  }
}

exports.UserRegisterSerializer = UserRegisterSerializer;
exports.UserLoginSerializer = UserLoginSerializer;
exports.UserSerializer = UserSerializer;