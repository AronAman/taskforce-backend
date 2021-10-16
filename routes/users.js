const router = require('express').Router();
const { getUser, signup, updatePassword, login, confirmEmail, resetPasswordFor } = require('../controllers/user');

/* GET users listing. */
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await getUser(id);
    res.json(user);
  } catch (err) {
    res.status(404).end();
  }
});

router.post('/signup', async (req, res) => {
  try {
    const newUser = await signup(req.body);
    res.json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        error: `${field} is already registered`
      });
    }
    res.status(500).json(err);
  }
});

router.get('/confirm-email/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const confirmed = await confirmEmail(token);
    res.json(confirmed);

  } catch (err) {
    res.json(err);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw { error: 'incorrect user or password' };
    const result = await login({ email, password });
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

router.post('/change-password/:id', async (req, res) => {
  const id = req.params.id;
  const password = req.body.password;

  try {
    if (!id || !password) throw ({ error: 'invalid id or password' });
    const user = await updatePassword(id, password);
    if (!user) throw { error: 'user not found' };
    res.json({ success: 'password updated' });
  } catch (err) {
    console.log(err);
    res.json(err);
  }

});


router.post('/reset-password', (req, res) => {
  const email = req.body.email;
  const resp = resetPasswordFor(email);
  res.json(resp);
});

router.get('/reset-password/:token', (req, res) => {
  res.json({});
});

module.exports = router;
