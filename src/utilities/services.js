import db from '../models/index';

const checkExist = async (req, res, next) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email=$1', [req.body.email]);
  if (rows[0]) {
    return res.status(400).json({
      status: 400,
      error: 'Email is already in use',
    });
  }
  return next();
};
export default checkExist; 
 