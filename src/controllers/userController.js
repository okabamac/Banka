import db from '../models/index';

class UserControl {
  static async getAll(req, res, next) {
    if (req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can access this routes'));
    }
    try {
      const { rows } = await db.query('SELECT * FROM users');
      return res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      res.status(500);
      return next(new Error('Something went wrong, please try again'));
    }
  }

  static async getOne(req, res, next) {
    if (req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can access this routes'));
    }
    const {
      id,
    } = req.params;
    try {
      const { rows } = await db.query('SELECT * FROM users WHERE id=$1', [id]);
      if (!rows[0]) return next();
      return res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      res.status(404);
      return next(new Error('Invalid ID'));
    }
  }

  static async getAllByEmail(req, res, next) {
    const {
      email,
    } = req.params;
    try {
      const { rows } = await db.query('SELECT * FROM users WHERE email=$1', [email]);
      if (!rows[0]) return next();
      const { id } = rows[0];
      if (req.decoded.id === id || req.decoded.type ==='staff') {
        const result = await db.query('SELECT * FROM accounts WHERE ownerId=$1', [id]);
        return res.status(200).json({
          status: 200,
          data: result.rows,
        });
      }
      res.status(401);
      return next('You don\'t have access to view this account details');
    } catch (e) {
      return next(new Error('Something went wrong! Please try again'));
    }
  }

  static async deleteUser(req, res, next) {
    if (req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can delete accounts'));
    }
    const {
      id,
    } = req.params;
    try {
      const {
        rows,
      } = await db.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);
      if (!rows[0]) return next();
      return res.json({
        status: 200,
        data: {
          status: 200,
          message: 'User successfully deleted!',
        },
      });
    } catch (e) {
      res.status(404);
      return next(new Error('Invalid ID'));
    }
  }
}

export default UserControl;
