const chai = require('chai');

const chaiHttp = require('chai-http');

const app = require('../app');

chai.use(chaiHttp);
chai.should();

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

    it('should get a single user record', (done) => {
      const id = 1;
      chai
        .request(app)
        .get(`/api/v1/users/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
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
      };
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User successfully added!');
          res.body.user.should.have.property('firstName');
          res.body.user.should.have.property('lastName');
          done();
        });
    });
    it('it should login a user ', (done) => {
      const user = {
        email: 'aaminu@email.com',
        password: 'fkf999evvmmvjfjff',
      };
      chai
        .request(app)
        .post('/api/v1/users/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User successfully logged in!');
          done();
        });
    });
  });
});