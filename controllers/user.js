const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Employee = require('../models/employee');
const empController = require('./employee');

const JWT_SECRET = process.env.JWT_SECRET;

const getUser = (id) => {
  return User.findById(id).populate('account');
};

const signup = async (obj) => {
  const newManager = await empController.create(obj);
  const newUser = new User({
    account: newManager.id
  });
  console.log(newUser._id);
  const confirmationToken = jwt.sign({ id: newUser.id }, JWT_SECRET);
  console.log(confirmationToken);
  return newUser.save();
};

const updatePassword = async (id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.findByIdAndUpdate(id, { password: hashedPassword });
};

const login = async (obj) => {
  const { email, password } = obj;
  const manager = await Employee.findOne({ email, position: 'manager' });
  if (!manager) throw { error: 'user doesn\'t exist' };

  const user = await User.findOne({ manager: manager.id }).populate('account', { name: 1, email: 1, position: 1, code: 1, status: 1 });
  if (!user) throw { error: 'user doesn\'t exist' };
  else if (!user.confirmed) throw { error: 'email not confirmed. Check you email' };
  else if (!user.password) throw { error: 'password not set' };
  else if (manager.status !== 'active') throw { error: 'account is suspended' };

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw { error: 'incorrect credentials' };
  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '7 days' });
  return { token };
};

const confirmEmail = async (token) => {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decodedToken.id);
    console.log(user);
    if (!user) throw { error: 'user does not exist' };
    user.confirmed = true;
    await user.save();
    return { success: 'confirmed' };

  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        return { error: 'token exipred' };
      case 'JsonWebTokenError':
        return { error: 'invalid token' };
      default:
        console.log(err.name);
        return { error: 'invalid token' };
    }
  }
};

const resetPasswordFor = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return { error: 'user not found' };
    // const resetToken = jwt.sign({id: user.id}, JWT_SECRET, '24h')
    /* 
        send reset password email here
         */
    return { success: 'reset password email sent' };
  } catch (error) {
    console.log(error);
  }
};

const verifyResetPasswordToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    return { success: 'token valid' };
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        return { error: 'token exipred' };
      case 'JsonWebTokenError':
        return { error: 'invalid token' };
      default:
        console.log(err.name);
        return { error: 'invalid token' };
    }
  }
};

module.exports = { getUser, signup, updatePassword, login, confirmEmail, resetPasswordFor, verifyResetPasswordToken };