import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../app';

import Users from '../src/models/userModel';

import Accounts from '../src/models/accountModel';

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);
chai.should();


const login_details = {
  email: 'markokaba99@gmail.com',
  password: 'johnbaby',
};

const user = {
  id: 123456,
  email: 'markokaba99@gmail.com',
  firstName: 'Mac',
  lastName: 'Okaba',
  password: '$2b$10$MWLVVYvFBQHvmjuRLFS6xuvZxpiN2KZJyQbCLb/lXxGZ2vGVmY2vy',
  type: 'staff',
  isAdmin: false,
};

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

const realAcc = {
  id: 23365,
  accountNumber: 2088058375,
  createdOn: 'July 21, 1983 01:15:00',
  owner: 123456,
  type: 'savings',
  status: 'active',
  currency: 'Naira',
  balance: 234567,
};

let theToken;

describe('Act as staff', () => {
  beforeEach((done) => {
    // Reset user mode before each test
    Users.length = 0;
    Users.push(user);
    Accounts.length = 0;
    Accounts.push(realAcc);
  });
});

describe('Do all staff will want to do', () => {
  it('should signin staff', (done) => {
    // follow up with login
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(login_details)
      .end((err, res) => {
        console.log('This runs the login part');
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('token');

        const {
          token,
        } = res.body.data;

        theToken = token;
        done();
      });
  });
  it('should get all accounts', (done) => {
    // follow up with get requests
    chai.request(app)
      .get('/api/v1/accounts/')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get specific account', (done) => {
    chai.request(app)
      .get('/api/v1/accounts/2088058375')

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get specific account', (done) => {
    chai.request(app)
      .get('/api/v1/accounts/ccddldlld')

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get all trans', (done) => {
    chai.request(app)
      .get('/api/v1/transactions/')

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');

        done();
      });
  });
  it('should not get specific trans', (done) => {
    chai.request(app)
      .get('/api/v1/transactions/jdjdjdjdjdj')

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get all accounts', (done) => {
    chai.request(app)
      .post('/api/v1/accounts/')
      .send(account)
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should modify account status', (done) => {
    chai.request(app)
      .patch('/api/v1/accounts/2088058375')
      .send({ status: 'dormant' })

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');

        done();
      });
  });
  it('should not modify account', (done) => {
    chai.request(app)
      .patch('/api/v1/accounts/20880583df')
      .send({
        status: 'dormant',
      })

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should delete account', (done) => {
    chai.request(app)
      .delete('/api/v1/accounts/2088058375')

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not delete account', (done) => {
    chai.request(app)
      .delete('/api/v1/accounts/208805228375')

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should credit a bank account', (done) => {
    chai.request(app)
      .post('/api/v1/transactions/2088058377/credit')
      .send({ amount: 200 })

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should debit a bank account', (done) => {
    chai.request(app)
      .post('/api/v1/transactions/2088058377/debit')
      .send({
        amount: 200,
      })

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');

        done();
      });
  });
  it('should not debit a bank account', (done) => {
    chai.request(app)
      .post('/api/v1/transactions/2088058377/debit')
      .send({
        amount: 25555555,
      })

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get all users', (done) => {
    chai.request(app)
      .get('/api/v1/users')

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get a specific user', (done) => {
    chai.request(app)
      .get('/api/v1/users/123456')
    // we set the auth header with our theToken
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get a specific user', (done) => {
    chai.request(app)
      .delete('/api/v1/users/12345fr6')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
});
