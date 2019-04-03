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

    it('should get a single user record', (done) => {
      const id = 1;
      chai
        .request(app)
        .get(`/api/v1/accounts/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
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
      };
      chai
        .request(app)
        .post('/api/v1/account/signup')
        .send(account)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Account successfully added!');
          res.body.account.should.have.property('firstName');
          res.body.account.should.have.property('lastName');
          done();
        });
    });
  });

  describe('PATCH /', () => {
    it('it should PATCH a bank account ', (done) => {
      const account = {
          accountNumber: 2088058375,
          action: 'activate'
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
