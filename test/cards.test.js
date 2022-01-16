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
        it('should get all cards with a deckId of 1', (done) => {
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
                    done();
                });
        });

        it('should return a response with a status of 404 for a nonexistent deck', (done) => {
            chai.request(app)
                .get('/cards?deckId=1000')
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    done();
                });
        });
    });

    describe('POST /cards', () => {
        it('should post a new card', (done) => {
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
                    done();
                });
        });

        it('should not post a card without a "front" property', (done) => {
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
                    done()
                });
        })

        it('should not post a card with an invalid property', (done) => {
            chai.request(app)
                .post('/cards')
                .send({
                    "data": {
                        "invalid": "Invalid",
                        "front": "Front",
                        "back": "Back",
                        "deckId": 1
                    }
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.have.string(`Invalid field`);
                    done()
                });
        });

        it('should not post a card with an that is manually set', (done) => {
            chai.request(app)
                .post('/cards')
                .send({
                    "data": {
                        "id": 1,
                        "front": "Front",
                        "back": "Back",
                        "deckId": 1
                    }
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.have.string(`Do not manually set the id for a card.`);
                    done();
                });
        });
    });

    describe('DELETE /cards/:cardId', () => {
        it('should delete a card with the specified id', (done) => {
            const cardId = 1;
            chai.request(app)
                .delete('/cards/' + cardId)
                .end((err, res) => {
                    expect(res.status).to.equal(204);
                    done();
                });
        });

        it ('should not delete a card that isn\'t in the database', (done) => {
            const cardId = 11;
            chai.request(app)
                .delete('/cards/' + cardId)
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.error.text).to.have.string(`not found`);
                    done();
                });
        });
    });

    describe('GET /cards/:cardId', () => {
        it('should get a card by id', (done) => {
            const cardId = 3;
            chai.request(app)
                .get('/cards/' + cardId)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.have.property('id').equal(3);
                    expect(res.body.data).to.have.property('front').equal("How do you pass data 'down' to a React child component?");
                    expect(res.body.data).to.have.property('back').equal("As properties or props");
                    expect(res.body.data).to.have.property('deckId').equal(1);
                    expect(res.body.data).to.have.property('created_at');
                    expect(res.body.data).to.have.property('updated_at');
                    done();
                });
        });

        it('should return a response with a status of 404 for a nonexistent card', (done) => {
            const cardId = 11;
            chai.request(app)
                .get('/cards/' + cardId)
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.error.text).to.have.string(`not found`);
                    done();
                });
        });
    });

    describe('PUT /cards/:cardId', () => {
        it('should update an existing card', (done) => {
            const cardId = 1;
            const newValue = "new front";
            const newData = {
                "data": {
                    "front": newValue
                }
            };
            chai.request(app)
                .put('/cards/' + cardId)
                .send(newData)
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.have.property('id').eq(cardId);
                    expect(res.body.data).to.have.property('front').eq(newValue);
                    expect(res.body.data).to.have.property('back').eq('Virtual DOM updates are faster but do not directly update the HTML');
                    expect(res.body.data).to.have.property('deckId').eq(1);
                    expect(res.body.data).to.have.property('created_at');
                    expect(res.body.data).to.have.property('updated_at');
                    done();
                });
        });

        it('should not update a card that is not in the database', (done) => {
            const cardId = 11;
            const newValue = "new front";
            const newData = {
                "data": {
                    "front": newValue
                }
            };
            chai.request(app)
                .put('/cards/' + cardId)
                .send(newData)
                .end((err, res) => {
                    expect(res.status).to.equal(404)
                    expect(res.error.text).to.have.string(`not found`);
                    done();
                });
        });

        it('should not update a card with an invalid property', (done) => {
            chai.request(app)
                .put('/cards/1')
                .send({
                    "data": {
                        "invalid": "Invalid",
                        "front": "Front",
                        "back": "Back",
                        "deckId": 1
                    }
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.have.string(`Invalid field`);
                    done()
                });
        });

        it('should not change the id value of a card', (done) => {
            const cardId = 1;
            const newValue = 2;
            const newData = {
                "data": {
                    "id": newValue
                }
            };
            chai.request(app)
                .put('/cards/' + cardId)
                .send(newData)
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.have.property('id').eq(cardId);
                    expect(res.body.data).to.have.property('front').eq('Differentiate between Real DOM and Virtual DOM.');
                    expect(res.body.data).to.have.property('back').eq('Virtual DOM updates are faster but do not directly update the HTML');
                    expect(res.body.data).to.have.property('deckId').eq(1);
                    expect(res.body.data).to.have.property('created_at');
                    expect(res.body.data).to.have.property('updated_at');
                    done();
                });
        });
    });
});