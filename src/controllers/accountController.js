
import joiHelper from '../utilities/joiHelper';

import accounts from '../models/accountModel';

import {
  createAccountSchema, patchAccountSchema,
} from '../utilities/validations';

class AccountControl {
  static async getAll (req, res, next) {
    res.json({
      status: 200,
      data: accounts,
    });
  }

  static async getOne(req, res, next) {
    const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(theAccount => theAccount.accountNumber == accountNumber)[0];
    if (!account) {
      return next();
    }
    res.json({
      status: 200,
      data: account,
    });
  }

  static async createAccount(req, res, next) {
    const validCreateAccount = await joiHelper(req, res, createAccountSchema);

    if (validCreateAccount.statusCode === 422) return;
    const {
      firstName, lastName, sex, dob, email, phone, type, currency,
    } = validCreateAccount;
    const account = {
      accountNumber: Math.floor(100000 + Math.random() * 9000000000), firstName, lastName, sex, dob, email, phone, type, currency,
    };
    account.openingBalance = 0.00;
    account.status = 'active';
    accounts.unshift(account);
    res.json({
      status: 200,
      data: account,
    });
  }

  static async modifyAccount (req, res, next) {
    const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(theAccount => theAccount.accountNumber == accountNumber)[0];
    if (!account) {
      return next();
    }
    const validPatch = await joiHelper(req, res, patchAccountSchema);
    if (validPatch.statusCode === 422) return;
    const {
      status,
    } = validPatch;
    account.status = validPatch.status;
    return res.json({
      status: 200,
      data: {
        accountNumber,
        status,
      },
    });
  }

  static async deleteAccount (req, res, next) {
    const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(theAccount => theAccount.accountNumber == accountNumber)[0];
    if (!account) return next();
    const index = accounts.indexOf(account);
    accounts.splice(index, 1);
    res.json({
      status: 200,
      message: 'Account successfully deleted',
    });
  }
}

export default AccountControl;
