const router = require('express').Router();

const { checkAuth } = require('../utils/middlewares');
const { search, findAll, findOne, create, update, deleteOne, toggleStatus } = require('../controllers/employee');

router.use(checkAuth);

router.get('/', async (req, res) => {
  const query = req.query.s;

  if (query) {
    const filtered = await search(query);
    return res.json(filtered);
  }
  const result = await findAll();
  res.json(result);

});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  const emp = await findOne(id);
  res.json(emp);

});

router.post('/create', async (req, res) => {
  const savedEmp = await create(req.body);
  res.status(201).json(savedEmp);

});

router.put('/:id', async (req, res) => {
  const id = req.params.id;

  const updatedEmp = await update(id, req.body);

  if (updatedEmp) return res.status(200).json(updatedEmp);

  res.status(404).end();

});

router.delete('/:id', async (req, res) => {
  const delId = req.params.id;

  const data = await deleteOne(delId);
  if (data) return res.status(204).json(data);

  res.status(404).end();
});

router.put('/toggle-status/:id', async (req, res) => {
  const id = req.params.id;

  const result = await toggleStatus(id);
  if (result) return res.status(200).json(result);

  res.status(404).end();

});

module.exports = router;