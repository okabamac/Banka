import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../server/app';


chai.use(chaiHttp);
chai.should();


const login_details = {
  email: 'amin@tolkien.com',
  password: 'johnbaby',
};

const register_details = {
  firstName: 'Aminu',
  lastName: 'Tolkien',
  email: 'amin@tolkien.com',
  password: 'johnbaby',
  confirmPassword: 'johnbaby',
};

const invalid_login_details = {
  email: 'amin@tolkien.com',
  password: 'hahahaha',
};

const account = {
  type: 'Savings',
  openingBalance: '2000.00'
}

let theToken;
let accNumber;

describe('It should do all clients will want to do', () => {
  it('should register a client', (done) => {
    // Register a user
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(register_details)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        done();
      });
  });
  it('should not register a client', (done) => {
    // Don't register because of existing email
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(register_details)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not login a client', (done) => {
    // follow up with not login because of invalid credentials
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(invalid_login_details)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it('should login a client', (done) => {
    // follow up with login
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(login_details)
      .end((err, res) => {
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

  it('should create a bank account', (done) => {
    // follow up with requesting user protected page
    chai.request(app)
      .post('/api/v1/accounts/')
      .send(account)
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');

        const {
          accountNumber,
        } = res.body.data;
        accNumber = accountNumber;
        done();
      });
  });
  it('should not create a bank account', (done) => {
    // follow up with requesting user protected page
    chai.request(app)
      .post('/api/v1/accounts/')
      .send({
        type: 'draft',
        openingBalance: 'eheheh',
      })
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get a transaction on account', (done) => {
    // Don't get a transaction cuz invalid accountnumber
    chai.request(app)
      .get('/api/v1/accounts/20880583/transactions')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get a transaction on account', (done) => {
    // Don't get a transaction cuz invalid accountnumber
    chai.request(app)
      .get('/api/v1/accounts/2088058375/transactions')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get a transaction on account', (done) => {
    // Don't get a transaction cuz invalid accountnumber
    chai.request(app)
      .get('/api/v1/accounts/2088058565556/transactions')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get transaction because of invalid id', (done) => {
    // Return not found
    chai.request(app)
      .get('/api/v1/transactions/cddfffff')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get transaction by id', (done) => {
    chai.request(app)
      .get('/api/v1/transactions/222')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('should not debit account', (done) => {
    // staff and admins page
    chai.request(app)
      .post('/api/v1/transactions/2088058375/debit')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not credit account', (done) => {
    chai.request(app)
      .post('/api/v1/transactions/2088058375/credit')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get all accounts', (done) => {
    chai.request(app)
      .get('/api/v1/accounts/')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });

  it('should not get accounts by number', (done) => {
    chai.request(app)
      .get('/api/v1/accounts/2088058375')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not delete account', (done) => {
    // Delete account
    chai.request(app)
      .delete('/api/v1/accounts/2088058375')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get all users', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get a user by ID', (done) => {
    chai.request(app)
      .get('/api/v1/users/1')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get all accounts linked with email', (done) => {
    chai.request(app)
      .get('/api/v1/users/amin@tolkien.com/accounts')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get all accounts linked with email', (done) => {
    chai.request(app)
      .get('/api/v1/users/amin@huhu.com/accounts')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get view all active accounts', (done) => {
    chai.request(app)
      .get('/api/v1/accounts?status=active')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should not get view all dormant accounts', (done) => {
    chai.request(app)
      .get('/api/v1/accounts?status=dormant')
      .set('Authorization', theToken)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
});
