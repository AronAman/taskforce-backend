const Employee = require('../models/employee');

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

module.exports = { search, findAll, findOne, create, update, deleteOne, toggleStatus };