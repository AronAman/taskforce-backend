const router = require('express').Router();
const Employee = require('../models/employee');

router.get('/', async (req, res) => {
  const query = req.query.s;
  if (query) {
    const filtered = await Employee.find({
      $or: [
        { name: { $regex: `.*${query}.*` } },
        { email: { $regex: `.*${query}.*` } },
        { phone_number: { $regex: `.*${query}.*` } },
        { code: { $regex: `.*${query}.*` } },
        { position: { $regex: `.*${query}.*` } }
      ]
    });
    return res.json(filtered); // returns search results
  }

  try {
    const data = await Employee.find({});

    res.json(data);
  } catch (err) {
    res.json(err);
  }

});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(401).json({
      error: 'Invalid request'
    });
  }
  try {
    const emp = await Employee.findById(id);
    if (!emp) return res.status(404).end();
    res.json(emp);
  } catch (err) {
    res.status(404).json(err);
  }

});

router.post('/create', async (req, res) => {
  // creates a new employee
  const { name, national_id, phone_number, email, date_of_birth, status } = req.body;


  let i = 0, done = false;
  while (i < 3 && !done) {
    try {
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
        status
      });
      const savedEmp = await emp.save();

      if (savedEmp) {
        done = true;
        return res.json(savedEmp);
      }

    } catch (err) {
      console.log(err.message);
    }
    i++;
    res.status(500).end();
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(401).json({
      error: 'Invalid request'
    });
  }
  const { name, national_id, phone_number, email, date_of_birth, status } = req.body;
  try {
    const data = {
      name,
      national_id,
      phone_number,
      email,
      date_of_birth: new Date(date_of_birth).toISOString(),
      status
    };
    const updatedEmp = await Employee.findByIdAndUpdate(id, data, { new: true });
    if(!updatedEmp) return res.status(404).end();
    res.json(updatedEmp);
  } catch (err) {
    console.log(err.message);
    res.json(err);
  }
});

router.put('/toggle-status/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(401).json({
      error: 'Invalid request'
    });
  }
  try {
    const emp = await Employee.findById(id);
    if (!emp) { return res.status(404).end(); }

    emp.status = emp.status === 'active' ? 'inactive' : 'active';

    const result = await emp.save();

    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.delete('/:id', async (req, res) => {
  const delId = req.params.id;
  if (!delId) {
    return res.status(401).json({
      error: 'Invalid request'
    });
  }
  try {
    const data = await Employee.findByIdAndDelete(delId);
    if (data) {
      console.log(data);
      return res.status(204).json(data);
    }
    res.status(404).end();
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;