
import users from '../models/userModel';

import accounts from '../models/accountModel';

class UserControl {
  static async getAll(req, res, next) {
    res.json({
      status: 200,
      data: users,
    });
  }

  static async getOne(req, res, next) {
    const {
      userId,
    } = req.params;
    const user = users.filter(theUser => theUser.id == userId)[0];
    if (!user) return next();
    return res.json({
      status: 200,
      data: user,
    });
  }

  static async getAllAccounts(req, res, next) {
    const {
      email,
    } = req.params;
    const allAccounts = await accounts.filter(allAcc => allAcc.email == email);
    if (allAccounts.length == 0) return next();
    return res.json({
      status: 200,
      data: allAccounts,
    });
  }
}

export default UserControl;
