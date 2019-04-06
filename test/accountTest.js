const chai = require('chai');

const chaiHttp = require('chai-http');

const app = require('../app');

chai.use(chaiHttp);
chai.should();

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
      const id = 1;
      chai
        .request(app)
        .get(`/api/v1/accounts/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('POST /', () => {
    it('it should POST a new bank account ', (done) => {
      const account = {
        firstName: 'Aminu',
        lastName: 'Tolkien',
        dob: '25-06-1995',
        sex: 'Male',
        email: 'amini@amini.com',
        phone: '+2349059564447',
        type: 'Savings',
        currency: 'Naira',
        address: 'No 12 Movida Crescent, Kubwa, Abuja',
      };
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
      const account = {
        accountNumber: 2088058375,
        action: 'activate',
      };
      chai
        .request(app)
        .post(`/api/v1/account/${account.accountNumber}`)
        .send(account)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Account successfully activated/deactivated!');
          res.body.account.should.have.property('firstName');
          res.body.account.should.have.property('lastName');
          done();
        });
    });
  });

  describe('DELETE /', () => {
    it('it should DELETE a bank account ', (done) => {
      const account = 2088058375;
      chai
        .request(app)
        .post(`/api/v1/account/${account}`)
        .send(account)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Account successfully deleted!');
          res.body.account.should.have.property('firstName');
          res.body.account.should.have.property('lastName');
          done();
        });
    });
  });
});