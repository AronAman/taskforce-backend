const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


const checkAuth = (req, res, next) => {
  const auth = req.get('authorization');
  if (!auth || !auth.toLocaleLowerCase().startsWith('bearer '))
    return res.status(401).end();
  const token = auth.substring(7);

  const decodedToken = jwt.verify(token, JWT_SECRET);

  if (decodedToken.user.account.position !== 'manager')
    return res.status(403).end();

  next();

};

const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case 'JsonWebTokenError':
      return res.status(400).json({ error: 'invalid token' });
    case 'CastError':
      return res.status(400).json({ error: 'malformed id' });
    case 'MongoServerError':
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
          error: `${field} is already registered`
        });
      } else {
        console.log(err);
      }
      break;

    case 'ValidationError':
      return res.status(400).json({ error: err.message });
    default:
      console.log(err.code);
      console.log(err.name);
      console.log(err.message);

      next('something broke');
      break;
  }
};


module.exports = {
  errorHandler,
  checkAuth
};