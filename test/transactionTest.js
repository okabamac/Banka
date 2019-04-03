const chai = require('chai');

const chaiHttp = require('chai-http');

const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('Transactions', () => {
  describe('GET /', () => {
    // Get all all transactions
    it('should get all transactions record', (done) => {
      chai
        .request(app)
        .get('/api/v1/transactions')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should get a single transaction record', (done) => {
      const id = 1;
      chai
        .request(app)
        .get(`/api/v1/transactions/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
  
  //Debit
  describe('POST /', () => {
    it('it should DEBIT a bank account', (done) => {
      const account = {
        firstName: 'Aminu',
        lastName: 'Tolkien',
      };
      chai
        .request(app)
        .post(`/api/v1/transactions/${account}/debit`)
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
    it('it should CREDIT a bank account', (done) => {
      const account = {
        firstName: 'Aminu',
        lastName: 'Tolkien',
      };
      chai
        .request(app)
        .post(`/api/v1/transactions/${account}/credit`)
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

});
