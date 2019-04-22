
import users from '../models/userModel';

class UserControl {
  static async getAll(req, res, next) {
    if (req.decoded.type == 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can access this routes'));
    }
    res.json({
      status: 200,
      data: users,
    });
  }

  static async getOne(req, res, next) {
    if (req.decoded.type == 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can access this routes'));
    }
    const {
      userId,
    } = req.params;
    const user = await users.filter(theUser => theUser.id == userId)[0];
    if (!user) return next();
    return res.json({
      status: 200,
      data: user,
    });
  }

  static async deleteUser(req, res, next) {
    if (req.decoded.type == 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can access this routes'));
    }
    const {
      userId,
    } = req.params;
    const user = await users.filter(theUser => theUser.id == userId)[0];
    if (!user) return next();
    const index = users.indexOf(user);
    users.splice(index, 1);
    res.json({
      status: 200,
      message: 'User successfully deleted',
    });
  }
}

export default UserControl;
