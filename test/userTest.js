import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../app';

import Users from '../src/models/userModel';
import Accounts from '../src/models/accountModel';

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

chai.use(chaiHttp);
chai.should();

describe('Users', () => {
  beforeEach((done) => { // Before each test we empty the database
    Users.length = 0;
    done();
  });
  describe('Users', () => {
    describe('GET /', () => {
    // Get all users
      it('should get all users record', (done) => {
        chai
          .request(app)
          .get('/api/v1/users')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
          });
      });
      it('should get all accounts by a user', (done) => {
        Accounts.length = 0;
        Accounts.push(account);
        chai
          .request(app)
          .get(`/api/v1/users/${account.email}/accounts`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
          });
      });

      it('should not get a single user record', (done) => {
        const id = 1;
        chai
          .request(app)
          .get(`/api/v1/users/${id}`)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            done();
          });
      });
    });

    describe('POST /', () => {
      it('it should POST a user ', (done) => {
        const user = {
          firstName: 'Aminu',
          lastName: 'Tolkien',
          email: 'amin@tolkien.com',
          password: 'johnbaby',
          confirmPassword: 'johnbaby',
        };
        chai
          .request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.have.property('id');
            res.body.data.should.have.property('firstName');
            res.body.data.should.have.property('lastName');
            res.body.data.should.have.property('email');
            res.body.data.should.have.property('type');
            res.body.data.should.have.property('admin');
            res.body.data.should.have.property('password');
            done();
          });
      });
      it('it should not login a user ', (done) => {
        const user = {
          email: 'aaminu@email.com',
          password: 'fkf999evvmmvjfjff',
        };
        chai
          .request(app)
          .post('/api/v1/auth/signin')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
    });
  });
});
