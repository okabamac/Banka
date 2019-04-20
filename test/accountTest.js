
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../app';

import Accounts from '../src/models/accountModel';

const account = {
  firstName: 'Aminu',
  lastName: 'Tolkien',
  dob: '1995-06-25',
  sex: 'Male',
  email: 'amini@amini.com',
  phone: '+2349059564447',
  type: 'Savings',
  currency: 'Naira',
  address: 'No 12 Movida Crescent, Kubwa, Abuja',
};

chai.use(chaiHttp);
chai.should();
describe('Accounts', () => {
  beforeEach((done) => { // Before each test we empty the database
    process.env.NODE_ENV = 'test';
    Accounts.length = 0;
    done();
  });
  describe('Accounts', () => {
    describe('GET /', () => {
    // Get all accounts
      it('should get all accounts record', (done) => {
        chai
          .request(app)
          .get('/api/v1/accounts')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
          });
      });

      it('should not get a single account record', (done) => {
        const id = 'ccc';
        chai
          .request(app)
          .get(`/api/v1/accounts/${id}`)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            done();
          });
      });
      it('should get a single account record', (done) => {
        Accounts.length = 0;
        const accountNumber = 2088058375;
        account.accountNumber = accountNumber;
        Accounts.push(account);
        chai
          .request(app)
          .get(`/api/v1/accounts/${accountNumber}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
          });
      });
    });

    describe('POST /', () => {
      it('it should POST a new bank account ', (done) => {
        delete account.accountNumber;
        Accounts.push(account);
        chai
          .request(app)
          .post('/api/v1/accounts')
          .send(account)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.have.property('accountNumber');
            res.body.data.should.have.property('firstName');
            res.body.data.should.have.property('lastName');
            res.body.data.should.have.property('dob');
            res.body.data.should.have.property('email');
            res.body.data.should.have.property('type');
            res.body.data.should.have.property('currency');
            res.body.data.should.have.property('openingBalance');
            res.body.data.should.have.property('status');
            done();
          });
      });
    });

    describe('PATCH /', () => {
      it('it should PATCH a bank account ', (done) => {
        const account2 = { ...account, accountNumber: 2088058375, status: 'dormant' };
        Accounts.push(account2);
        const status = {
          status: 'active',
        };
        chai
          .request(app)
          .patch('/api/v1/accounts/2088058375')
          .send(status)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.have.property('accountNumber');
            res.body.data.should.have.property('status');
            done();
          });
      });
      it('it should not PATCH a bank account ', (done) => {
        const account2 = { ...account, accountNumber: 2088058376, status: 'dormant' };
        Accounts.push(account2);
        const status = {
          status: 'active',
        };
        chai
          .request(app)
          .patch('/api/v1/accounts/2088058375')
          .send(status)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            done();
          });
      });
    });

    describe('DELETE /', () => {
      it('it should DELETE a bank account ', (done) => {
        const newAcc = { accountNumber: 2088058375, ...account, status: 'active' };
        Accounts.push(newAcc);
        chai
          .request(app)
          .delete(`/api/v1/accounts/${newAcc.accountNumber}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Account successfully deleted');
            done();
          });
      });
      it('it should not DELETE a bank account ', (done) => {
        chai
          .request(app)
          .delete('/api/v1/accounts/2088058375')
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            done();
          });
      });
    });
  });
});
