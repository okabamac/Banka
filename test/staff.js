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


describe('Act as staff', () => {
  beforeEach((done) => {
    // Reset user mode before each test
    Users.length = 0;
    Users.push(user);
    Accounts.length = 0;
    Accounts.push(realAcc);
  });
});

describe('/Staff', () => {
  it('Do all routes staff will want to do', (done) => {
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

        // follow up with get requests
        chai.request(app)
          .get('/api/v1/accounts/')
        // we set the auth header with our token
          .set('Authorization', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');

            chai.request(app)
              .get('/api/v1/accounts/2088058375')
            // we set the auth header with our token
              .set('Authorization', token)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');

                chai.request(app)
                  .get('/api/v1/accounts/ccddldlld')
                // we set the auth header with our token
                  .set('Authorization', token)
                  .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');

                    chai.request(app)
                      .get('/api/v1/transactions/')
                    // we set the auth header with our token
                      .set('Authorization', token)
                      .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        chai.request(app)
                          .get('/api/v1/transactions/jdjdjdjdjdj')
                        // we set the auth header with our token
                          .set('Authorization', token)
                          .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.be.a('object');

                            chai.request(app)
                              .post('/api/v1/accounts/')
                              .send(account)
                            // we set the auth header with our token
                              .set('Authorization', token)
                              .end((err, res) => {
                                res.should.have.status(401);
                                res.body.should.be.a('object');

                                chai.request(app)
                                  .patch('/api/v1/accounts/2088058375')
                                  .send({ status: 'dormant' })
                                // we set the auth header with our token
                                  .set('Authorization', token)
                                  .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');

                                    chai.request(app)
                                      .patch('/api/v1/accounts/20880583df')
                                      .send({
                                        status: 'dormant',
                                      })
                                    // we set the auth header with our token
                                      .set('Authorization', token)
                                      .end((err, res) => {
                                        res.should.have.status(404);
                                        res.body.should.be.a('object');

                                        chai.request(app)
                                          .delete('/api/v1/accounts/2088058375')
                                        // we set the auth header with our token
                                          .set('Authorization', token)
                                          .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.should.be.a('object');

                                            chai.request(app)
                                              .delete('/api/v1/accounts/208805228375')
                                            // we set the auth header with our token
                                              .set('Authorization', token)
                                              .end((err, res) => {
                                                res.should.have.status(404);
                                                res.body.should.be.a('object');

                                                chai.request(app)
                                                  .post('/api/v1/transactions/2088058377/credit')
                                                  .send({ amount: 200 })
                                                // we set the auth header with our token
                                                  .set('Authorization', token)
                                                  .end((err, res) => {
                                                    res.should.have.status(200);
                                                    res.body.should.be.a('object');

                                                    chai.request(app)
                                                      .post('/api/v1/transactions/2088058377/debit')
                                                      .send({
                                                        amount: 200,
                                                      })
                                                    // we set the auth header with our token
                                                      .set('Authorization', token)
                                                      .end((err, res) => {
                                                        res.should.have.status(200);
                                                        res.body.should.be.a('object');


                                                        chai.request(app)
                                                          .post('/api/v1/transactions/2088058377/debit')
                                                          .send({
                                                            amount: 25555555,
                                                          })
                                                        // we set the auth header with our token
                                                          .set('Authorization', token)
                                                          .end((err, res) => {
                                                            res.should.have.status(400);
                                                            res.body.should.be.a('object');

                                                            chai.request(app)
                                                              .get('/api/v1/users')
                                                            // we set the auth header with our token
                                                              .set('Authorization', token)
                                                              .end((err, res) => {
                                                                res.should.have.status(200);
                                                                res.body.should.be.a('object');

                                                                chai.request(app)
                                                                  .get('/api/v1/users/123456')
                                                                  // we set the auth header with our token
                                                                  .set('Authorization', token)
                                                                  .end((err, res) => {
                                                                    res.should.have.status(200);
                                                                    res.body.should.be.a('object');
                                                                    done();
                                                                  });
                                                              });
                                                          });
                                                      });
                                                  });
                                              });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
          });
      });
  });
});
