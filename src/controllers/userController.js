
import users from '../models/userModel';

class UserControl {
  static async getAll (req, res, next)  {
    res.json({
      status: 200,
      data: users,
    });
  }

  static async getOne (req, res, next)  {
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
}

export default UserControl;
