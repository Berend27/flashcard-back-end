process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require("chai").expect;
const knex = require("../src/db/connection");
const app = require('../src/app');

chai.use(chaiHttp);

describe('cards API routes', () => {
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

    describe('GET /cards', () => {
        it('should get all cards with a deckId of 1', () => {
            chai.request(app)
                .get('/cards?deckId=1')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data.length).to.equal(3);
                    expect(res.body.data[2]).to.have.property('id').equal(3);
                    expect(res.body.data[2]).to.have.property('front').equal("How do you pass data 'down' to a React child component?");
                    expect(res.body.data[2]).to.have.property('back').equal("As properties or props");
                    expect(res.body.data[2]).to.have.property('deckId').equal(1);
                    expect(res.body.data[2]).to.have.property('created_at');
                    expect(res.body.data[2]).to.have.property('updated_at');
                });
        });

        it('should return a response with a status of 404 for a nonexistent deck', () => {
            chai.request(app)
                .get('/cards?deckId=1000')
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                });
        });
    });

    describe('POST /cards', () => {
        it('should post a new card', () => {
            chai.request(app)
                .post('/cards')
                .send({
                    "data": {
                        "front": "Front",
                        "back": "Back",
                        "deckId": 1
                    }
                })
                .end((err, res) => {
                    expect(res.status).to.equal(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.have.property('id');
                    expect(res.body.data).to.have.property('front').equal("Front");
                    expect(res.body.data).to.have.property('back').equal("Back");
                    expect(res.body.data).to.have.property('deckId').equal(1);
                    expect(res.body.data).to.have.property('created_at');
                    expect(res.body.data).to.have.property('updated_at');
                });
        });

        it('should not post a card without a "front" property', () => {
            chai.request(app)
                .post('/cards')
                .send({
                    "data": {
                        "back": "Back",
                        "deckId": 1
                    }
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.equal(`{"error":"A 'front' property is required."}`);
                });
        })
    })
})