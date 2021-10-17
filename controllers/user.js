const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sendMail = require('../utils/mail');
const User = require('../models/user');
const Employee = require('../models/employee');
const empController = require('./employee');

const JWT_SECRET = process.env.JWT_SECRET;
const { loginVal, emailVal } = require('../utils/validators');


const getUser = (id) => {
  return User.findById(id).populate('account');
};

const signup = async (obj) => {

  const newManager = await empController.create(obj);
  if (newManager.error) return { error: newManager };

  const newUser = new User({
    account: newManager.id
  });
  /* 
  send confirmation email
   */
  const confirmationToken = jwt.sign({ id: newUser.id }, JWT_SECRET);
  console.log(confirmationToken);

  const emailResp = await sendConfirmLink({ email: newManager.email, token: confirmationToken });
  console.log(emailResp);

  return newUser.save();
};

const updatePassword = async (id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.findByIdAndUpdate(id, { password: hashedPassword });
};

const login = async (obj) => {
  const error = loginVal(obj);
  if (error) return { error: error.details[0].message };

  const { email, password } = obj;
  const manager = await Employee.findOne({ email, position: 'manager' });
  if (!manager) return { error: 'incorrect credentials' };

  const user = await User.findOne({ manager: manager.id }).populate('account', { name: 1, email: 1, position: 1, code: 1, status: 1 });
  if (!user) return { error: 'incorrect credentials' };
  else if (!user.confirmed) return { error: 'email not confirmed. check your email' };
  else if (!user.password) return { error: 'password not set' };
  else if (manager.status !== 'active') return { error: 'account suspended' };

  const match = await bcrypt.compare(password, user.password);

  if (!match) return { error: 'incorrect credentials' };

  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '7 days' });
  return { token };
};

const confirmEmail = async (token) => {
  const decodedToken = jwt.verify(token, JWT_SECRET);

  const user = await User.findById(decodedToken.id);

  if (!user) return { error: 'user does not exist' };
  user.confirmed = true;
  return await user.save();

};

const resetPasswordFor = async (email) => {
  const { error } = emailVal(email);
  if (error) return { error: error.details[0].message };

  const user = await User.findOne({ email });
  if (!user) return { error: 'user not found' };
  const passwordResetToken = jwt.sign({ id: user.id }, JWT_SECRET, '24h');
  console.log(passwordResetToken);
  /* 
  send reset password email here
   */
  const emailResp = await sendResetLink({ email, token: passwordResetToken });
  console.log(emailResp);

  return { success: 'reset password email sent' };

};

const verifyResetPasswordToken = (token) => {
  const decodedToken = jwt.verify(token, JWT_SECRET);

  return { success: 'token valid', decodedId: decodedToken.id };

};

const sendConfirmLink = (obj) => {

  const { email, token } = obj;
  return sendMail(email, 'Confirm Email', `Click <a href='localhost:3000/api/user/confirm-email/${token}'>here</a> to confirm your account`);
};

const sendResetLink = (obj) => {

  const { email, token } = obj;
  return sendMail(email, 'Reset Password', `Click <a href='localhost:3000/api/user/reset-password/${token}'>here</a> to reset your passowrd`);
};
module.exports = { getUser, signup, updatePassword, login, confirmEmail, resetPasswordFor, verifyResetPasswordToken };