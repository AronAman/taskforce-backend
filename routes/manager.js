const router = require('express').Router();
const { search, findAll, findOne, create, update, deleteOne, toggleStatus } = require('../controllers/employee');

router.get('/', async (req, res) => {
  const query = req.query.s;

  try {
    if (query) {
      const filtered = await search(query);
      return res.json(filtered); // returns search results
    }
    const result = await findAll();
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: 'malformed request' });
  }

});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const emp = await findOne(id);
    res.json(emp);
  } catch (err) {
    // console.log(err)
    res.status(400).json({ error: 'malformed request' });
  }

});

router.post('/create', async (req, res) => {
  try {

    const savedEmp = await create(req.body);
    if (savedEmp) {
      return res.json(savedEmp);
    }
    res.status(405).end();

  } catch (err) {
    console.log(err.message);
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        error: `${field} is already registered`
      });
    }
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const updatedEmp = await update(id, req.body);

    if (!updatedEmp) return res.status(403).end();
    res.staus(201).json(updatedEmp);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: 'malformed request' });
  }
});

router.delete('/:id', async (req, res) => {
  const delId = req.params.id;

  try {
    const data = await deleteOne(delId);
    if (data) {
      console.log(data);
      return res.status(204).json(data);
    }
    res.status(404).end();
  } catch (error) {
    res.status(404).end();
  }
});

router.put('/toggle-status/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await toggleStatus(id);
    if (!result) throw ('not found');

    res.status(201).json(result);
  } catch (err) {
    // console.log(err);
    res.status(404).end();
  }
});

module.exports = router;