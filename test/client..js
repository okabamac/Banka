import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../app';

import Users from '../src/models/userModel';

process.env.NODE_ENV = 'test';

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

/**
 * Test the following in on scoop:
 * - Create an account, login with details, and check if token comes
 */

describe('Act as client', () => {
  beforeEach((done) => {
    // Reset user mode before each test
    Users.length = 0;
  });
});

describe('/POST Register', () => {
  it('Do all routes clients will want to do', (done) => {
    // Register a user
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(register_details)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');

        // Don't register because of existing email
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(register_details)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');

            // follow up with not login because of invalid credentials
            chai.request(app)
              .post('/api/v1/auth/signin')
              .send(invalid_login_details)
              .end((err, res) => {
                console.log('This runs the login part');
                res.should.have.status(400);
                res.body.should.be.a('object');

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
                    // follow up with requesting user protected page
                    chai.request(app)
                      .post('/api/v1/accounts/')
                      .send(account)
                    // we set the auth header with our token
                      .set('Authorization', token)
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

                        // Get all transaction on account
                        chai.request(app)
                          .get('/api/v1/transactions/client/2088058375')
                        // we set the auth header with our token
                          .set('Authorization', token)
                          .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');

                            // Don't get a transaction cuz invalid accountnumber
                            chai.request(app)
                              .get('/api/v1/transactions/client/2088058378')
                            // we set the auth header with our token
                              .set('Authorization', token)
                              .end((err, res) => {
                                res.should.have.status(404);
                                res.body.should.be.a('object');

                                // Get a transaction by ID
                                chai.request(app)
                                  .get('/api/v1/transactions/54788494')
                                // we set the auth header with our token
                                  .set('Authorization', token)
                                  .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');

                                    // Return not found
                                    chai.request(app)
                                      .get('/api/v1/transactions/cddfffff')
                                    // we set the auth header with our token
                                      .set('Authorization', token)
                                      .end((err, res) => {
                                        res.should.have.status(404);
                                        res.body.should.be.a('object');

                                        // Staff and admins page
                                        chai.request(app)
                                          .post('/api/v1/transactions/2088058375/debit')
                                        // we set the auth header with our token
                                          .set('Authorization', token)
                                          .end((err, res) => {
                                            res.should.have.status(401);
                                            res.body.should.be.a('object');

                                            chai.request(app)
                                              .post('/api/v1/transactions/2088058375/credit')
                                            // we set the auth header with our token
                                              .set('Authorization', token)
                                              .end((err, res) => {
                                                res.should.have.status(401);
                                                res.body.should.be.a('object');

                                                chai.request(app)
                                                  .get('/api/v1/accounts/')
                                                // we set the auth header with our token
                                                  .set('Authorization', token)
                                                  .end((err, res) => {
                                                    res.should.have.status(401);
                                                    res.body.should.be.a('object');

                                                    chai.request(app)
                                                      .get('/api/v1/accounts/2088058375')
                                                    // we set the auth header with our token
                                                      .set('Authorization', token)
                                                      .end((err, res) => {
                                                        res.should.have.status(401);
                                                        res.body.should.be.a('object');

                                                        // Delete account
                                                        chai.request(app)
                                                          .delete('/api/v1/accounts/2088058375')
                                                        // we set the auth header with our token
                                                          .set('Authorization', token)
                                                          .end((err, res) => {
                                                            res.should.have.status(401);
                                                            res.body.should.be.a('object');


                                                            chai.request(app)
                                                              .get('/api/v1/users')
                                                              // we set the auth header with our token
                                                              .set('Authorization', token)
                                                              .end((err, res) => {
                                                                res.should.have.status(401);
                                                                res.body.should.be.a('object');

                                                                chai.request(app)
                                                                  .get('/api/v1/users/1')
                                                                // we set the auth header with our token
                                                                  .set('Authorization', token)
                                                                  .end((err, res) => {
                                                                    res.should.have.status(401);
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
