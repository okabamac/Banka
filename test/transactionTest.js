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

    it('should not get a single transaction record', (done) => {
      const id = 1;
      chai
        .request(app)
        .get(`/api/v1/transactions/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  // Credit
  describe('POST /', () => {
    it('it should CREDIT a bank account ', (done) => {
      const account = {
        amount: '375',
        transactionType: 'credit',
      };
      chai
        .request(app)
        .post('/api/v1/transactions/2088058375/credit')
        .send(account)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.data.should.have.property('transactionId');
          res.body.data.should.have.property('accountNumber');
          res.body.data.should.have.property('amount');
          res.body.data.should.have.property('cashier');
          res.body.data.should.have.property('transactionType');
          res.body.data.should.have.property('createdOn');
          res.body.data.should.have.property('currency');
          res.body.data.should.have.property('oldBalance');
          res.body.data.should.have.property('newBalance');
          done();
        });
    });


    // Debit
    it('it should DEBIT a bank account', (done) => {
      const account = {
        accountNumber: 'Aminu',
        amount: 'Tolkien',
        cashier: 'Tolkien',
        transactionType: 'Tolkien',
      };
      chai
        .request(app)
        .post(`/api/v1/transactions/${account.accountNumber}/debit`)
        .send(account)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.data.should.have.property('transactionId');
          res.body.data.should.have.property('accountNumber');
          res.body.data.should.have.property('amount');
          res.body.data.should.have.property('cashier');
          res.body.data.should.have.property('transactionType');
          res.body.data.should.have.property('accountBalance');
          done();
        });
    });
  });
});