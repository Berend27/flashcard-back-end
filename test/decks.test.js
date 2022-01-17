process.env.NODE_ENV = 'test';

const app = require('../src/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require("chai").expect;
const knex = require("../src/db/connection");

chai.use(chaiHttp);

describe('decks API routes', () => {
    beforeEach((done) => {
        knex.migrate.rollback()
            .then(() => knex.migrate.latest())
            .then(() => knex.seed.run())
            .then(() => done())
            .catch(done);
    });

    afterEach(done => {
        knex.migrate.rollback()
            .then(() => { done() });
    });

    describe('GET /decks', () => {
        it(`should get all decks`, (done) => {
            chai.request(app)
                .get('/decks')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data.length).to.equal(2);
                    expect(res.body.data[0]).to.have.property('id').eq(1);
                    expect(res.body.data[0]).to.have.property('name');
                    expect(res.body.data[0]).to.have.property('description');
                    expect(res.body.data[0]).to.have.property('created_at');
                    expect(res.body.data[0]).to.have.property('updated_at');
                    expect(res.body.data[0]).to.not.have.property('cards');
                    done();
                });
        });
    });

    // todo: GET /decks?_embed=cards
});