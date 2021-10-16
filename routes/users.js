const router = require('express').Router();
const { getUser, signup, updatePassword, login, confirmEmail, resetPasswordFor, verifyResetPasswordToken } = require('../controllers/user');

/* GET users listing. */
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const user = await getUser(id);
  res.json(user);

});

router.post('/signup', async (req, res) => {
  const newUser = await signup(req.body);
  res.json(newUser);

});

router.get('/confirm-email/:token', async (req, res) => {
  const token = req.params.token;
  const confirmed = await confirmEmail(token);
  if (!confirmed.error) return res.status(200).json(confirmed);
  res.status(403).json(confirmed);

});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const resp = await login({ email, password });
  if (!resp.error) return res.json(resp);
  res.status(400).json(resp);

});

router.post('/change-password/:id', async (req, res) => {
  const id = req.params.id;
  const password = req.body.password;

  const resp = await updatePassword(id, password);
  if (resp) return res.json({ success: 'password updated' });

});


router.post('/reset-password', (req, res) => {
  const email = req.body.email;
  const resp = resetPasswordFor(email);
  res.json(resp);
});

router.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  const resp = verifyResetPasswordToken(token);
  res.json(resp);
});

module.exports = router;
