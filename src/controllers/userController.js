import db from '../models/index';

class UserControl {
  static async getAll(req, res, next) {
    if (req.decoded.type == 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can access this routes'));
    }
    try {
      const { rows } = await db.query('SELECT * FROM users');
      res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      res.status(500);
      next(new Error('Something went wrong, please try again'));
    }
  }

  static async getOne(req, res, next) {
    if (req.decoded.type == 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can access this routes'));
    }
    const {
      userId,
    } = req.params;
    try {
      const { rows } = await db.query('SELECT * FROM users WHERE id=$1', [userId]);
      if (!rows[0]) return next();
      return res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      res.status(404);
      next(new Error('Invalid ID'));
    }
  }

  static async deleteUser(req, res, next) {
    if (req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can delete accounts'));
    }
    const {
      userId,
    } = req.params;
    try {
      const {
        rows,
      } = await db.query('DELETE FROM users WHERE id=$1 RETURNING *', [userId]);
      if (!rows[0]) return next();
      res.json({
        status: 200,
        data: {
          status: 200,
          message: 'User successfully deleted!',
        },
      });
    } catch (e) {
      res.status(404);
      next(new Error('Invalid ID'));
    }
  }
}

export default UserControl;
