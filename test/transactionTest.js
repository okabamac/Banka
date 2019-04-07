const chai = require('chai');

const chaiHttp = require('chai-http');

const app = require('../app');

const Transactions = require('../src/models/transactionModel');

const Accounts = require('../src/models/accountModel');

chai.use(chaiHttp);
chai.should();
// Our parent block
describe('Transactions', () => {
  beforeEach((done) => { // Before each test we empty the database
    Transactions.length = 0;
    done();
  });

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


    describe('POST /', () => {
    // Credit
      it('it should CREDIT a bank account ', (done) => {
        Accounts.length = 0;
        const account = {
          accountNumber: 2088058375,
          firstName: 'Aminu',
          lastName: 'Tolkien',
          dob: '1995-06-25',
          sex: 'Male',
          email: 'amini@amini.com',
          phone: '+2349059564447',
          type: 'Savings',
          currency: 'Naira',
          balance: 0,
          address: 'No 12 Movida Crescent, Kubwa, Abuja',
        };
        Accounts.push(account);
        const credit = {
          amount: '375',
          transactionType: 'credit',
        };
        chai
          .request(app)
          .post(`/api/v1/transactions/${account.accountNumber}/credit`)
          .send(credit)
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
        const debit = {
          amount: '200',
          transactionType: 'debit',
        };
        chai
          .request(app)
          .post('/api/v1/transactions/2088058375/debit')
          .send(debit)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.have.property('transactionId');
            res.body.data.should.have.property('accountNumber');
            res.body.data.should.have.property('amount');
            res.body.data.should.have.property('cashier');
            res.body.data.should.have.property('transactionType');
            res.body.data.should.have.property('oldBalance');
            res.body.data.should.have.property('newBalance');
            done();
          });
      });
    });
  });
});
