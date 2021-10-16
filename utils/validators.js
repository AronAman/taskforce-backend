const Joi = require('joi');

const validateAge = (value) => {
  const today = new Date();
  let age;
  try {
    const dob = new Date(value);
    age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) throw new Error('age is younger than 18');
    return value;
  } catch (err) {
    // throw err
    console.log(err.message);
    if (err) throw new Error(err.message);
    throw new Error('invalid date');
  }
};

const employeeVal = data => {
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    national_id: Joi.string()
      .pattern(new RegExp('^([0-9]{16})$'))
      .required(),
    phone_number: Joi.string()
      .pattern(new RegExp('^(00|[+])?(256)?[0-9]{9}$'))
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    date_of_birth: Joi.string()
      .required()
      .custom(validateAge, 'custom age validation'),
  }).unknown();

  return schema.validate(data);
};

const loginVal = data => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .required()
      .min(6)
  }).unknown();
  return schema.validate(data);
};


const emailVal = data => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
  }).unknown();
  return schema.validate(data);
};

module.exports = {
  employeeVal,
  loginVal,
  emailVal
};