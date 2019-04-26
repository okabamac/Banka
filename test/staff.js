import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../server/app';

chai.use(chaiHttp);
chai.should();


const login_details = {
  email: 'aminuaminu@g.com',
  password: 'johnbaby',
};
let theToken;

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
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get specific trans', (done) => {
    chai.request(app)
      .get('/api/v1/transactions/1')

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
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
  it('should not delete account', (done) => {
    chai.request(app)
      .delete('/api/v1/accounts/2088058379')

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not credit a bank account', (done) => {
    chai.request(app)
      .post('/api/v1/transactions/2088058377/credit')
      .send({ amount: 200 })

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should credit a bank account', (done) => {
    chai.request(app)
      .post('/api/v1/transactions/2088058375/credit')
      .send({ amount: 200 })

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
        amount: 200,
      })

      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(404);
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
  it('should get a specific user', (done) => {
    chai.request(app)
      .get('/api/v1/users/1')
    // we set the auth header with our theToken
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get all dormant accounts', (done) => {
    chai.request(app)
      .get('/api/v1/accounts?status=dormant')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get all active accounts', (done) => {
    chai.request(app)
      .get('/api/v1/accounts?status=active')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});
