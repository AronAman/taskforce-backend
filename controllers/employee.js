const Employee = require('../models/employee');
const { employeeVal } = require('../utils/validators');
const sendMail = require('../utils/mail');

const search = (query) => {
  return Employee.find({
    $or: [
      { name: { $regex: `.*${query}.*` } },
      { email: { $regex: `.*${query}.*` } },
      { phone_number: { $regex: `.*${query}.*` } },
      { code: { $regex: `.*${query}.*` } },
      { position: { $regex: `.*${query}.*` } }
    ]
  });
};

const findAll = () => {
  return Employee.find({});
};

const findOne = (id) => {
  return Employee.findById(id);
};

const create = (obj) => {
  const { error } = employeeVal(obj);

  if (error) return { error: error.details[0].message };

  const { name, national_id, phone_number, email, date_of_birth, status, position } = obj;

  const randNo = Math.floor(Math.random() * (1, 9999) + 1);
  const empCode = `000${randNo}`;
  const code = `EMP${empCode.substring(empCode.length - 4)}`;

  const emp = new Employee({
    name,
    national_id,
    code,
    phone_number,
    email,
    date_of_birth: new Date(date_of_birth).toISOString(),
    status,
    position: position ? position : 'manager'
  });
  return emp.save();
};

const update = (id, obj) => {
  const { error } = employeeVal(obj);
  if (error) return { error: error.details[0].message };

  const { name, national_id, phone_number, email, date_of_birth, status, position } = obj;
  const data = {
    name,
    national_id,
    phone_number,
    email,
    date_of_birth: new Date(date_of_birth).toISOString(),
    status,
    position
  };
  return Employee.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteOne = (id) => {
  return Employee.findByIdAndDelete(id);
};

const toggleStatus = async (id) => {
  const emp = await Employee.findById(id);

  if (!emp) return null;

  emp.status = emp.status === 'active' ? 'inactive' : 'active';

  return emp.save();
};

const welcomeEmployee = (obj) => {
  /* 
  send welcome email
   */
  const { email } = obj;
  
  return sendMail(email, 'Account created', `<p>Welcome ${obj.name}. Your account with the company task-force has been successfully created.</p>`);

};

module.exports = { search, findAll, findOne, create, update, deleteOne, toggleStatus, welcomeEmployee };