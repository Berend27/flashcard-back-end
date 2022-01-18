process.env.NODE_ENV = 'test';

const app = require('../src/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require("chai").expect;
const knex = require("../src/db/connection");

chai.use(chaiHttp);

describe(`decks API routes`, () => {
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

    describe(`GET /decks`, () => {
        it(`should get all decks`, (done) => {
            chai.request(app)
                .get(`/decks`)
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

    describe(`GET /decks?_embed=cards`, () => {
        it(`should get all decks each with a cards property added`, (done) => {
            chai.request(app)
                .get(`/decks?_embed=cards`)
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
                    expect(res.body.data[0]).to.have.property('cards');
                    expect(res.body.data[0].cards).to.be.an('array');
                    done();
                });
        });
    });

    describe(`POST /decks`, () => {
        it(`should post a new deck`, (done) => {
            const name = "Spanish Adjectives";
            const description = "Adjectives in Spanish";
            chai.request(app)
                .post(`/decks`)
                .send({
                    "data": {
                        "name": name,
                        "description": description,
                    }
                })
                .end((err, res) => {
                    expect(res.status).to.equal(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.have.property('id');
                    expect(res.body.data).to.have.property('name').eq(name);
                    expect(res.body.data).to.have.property('description').eq(description);
                    expect(res.body.data).to.have.property('created_at');
                    expect(res.body.data).to.have.property('updated_at');
                    done();
                });
        }); 

        it('should not post a deck without a "name" property', (done) => {
            chai.request(app)
                .post(`/decks`)
                .send({
                    "data": {
                        "description": "example description",
                    }
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.equal(`{"error":"A 'name' property is required."}`);
                    done()
                });
        });

        it('should not post a deck with an invalid property', (done) => {
            const name = "Spanish Adjectives";
            const description = "Adjectives in Spanish";
            chai.request(app)
                .post(`/decks`)
                .send({
                    "data": {
                        "invalid": "value", 
                        "name": name,
                        "description": description,
                    }
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.have.string(`Invalid field`);
                    done();
                });
        });

        it('should not post a deck with id that is manually set', (done) => {
            const name = "Spanish Adjectives";
            const description = "Adjectives in Spanish";
            chai.request(app)
                .post(`/decks`)
                .send({
                    "data": {
                        "id": 3, 
                        "name": name,
                        "description": description,
                    }
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.have.string(`Do not manually set the id for a deck.`);
                    done();
                });
        });
    });

    describe('DELETE /decks/:deckId', () => {
        it('should delete a deck with the specified id', (done) => {
            const deckId = 1;
            chai.request(app)
                .delete('/decks/' + deckId)
                .end((err, res) => {
                    expect(res.status).to.equal(204);
                    done();
                });
        });

        it('should not delete a deck that isn\'t in the database', (done) => {
            const deckId = 1000;
            chai.request(app)
                .delete('/decks/' + 1000)
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.error.text).to.have.string(`not found`);
                    done();
                });
        });
    });

    describe('GET /decks/:deckId', () => {
        it('should get a deck by id', (done) => {
            const deckId = 1;
            chai.request(app)
                .get('/decks/' + deckId)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.have.property('id').eq(deckId);
                    expect(res.body.data).to.have.property('name').eq("Rendering in React");
                    expect(res.body.data).to.have.property('description').eq("React's component structure allows for quickly building a complex web application that relies on DOM manipulation.");
                    expect(res.body.data).to.have.property('created_at');
                    expect(res.body.data).to.have.property('updated_at');
                    expect(res.body.data).to.not.have.property('cards');
                    done();
                });
        });

        it('should return a response with a status of 404 for a nonexistent deck', (done) => {
            const deckId = 1000;
            chai.request(app)
                .get('/decks/' + deckId)
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.error.text).to.have.string(`not found`);
                    done();
                });
        });
    });

    describe('GET /decks/:deckId?_embed=cards', () => {
        it('should get a deck by id with a cards property added', (done) => {
            const deckId = 1;
            chai.request(app)
                .get('/decks/' + deckId + '?_embed=cards')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.have.property('id').eq(deckId);
                    expect(res.body.data).to.have.property('name').eq("Rendering in React");
                    expect(res.body.data).to.have.property('description').eq("React's component structure allows for quickly building a complex web application that relies on DOM manipulation.");
                    expect(res.body.data).to.have.property('created_at');
                    expect(res.body.data).to.have.property('updated_at');
                    expect(res.body.data).to.have.property('cards');
                    expect(res.body.data.cards).to.be.an('array');
                    done();
                });
        });
    });

    describe('PUT /decks/:deckId', () => {
        it('should update an existing deck', (done) => {
            const deckId = 1;
            const newName = "Rendering with React";
            const newData = {
                "data": {
                    "name": newName
                }
            };
            chai.request(app)
                .put('/decks/' + deckId)
                .send(newData)
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.have.property('id').eq(deckId);
                    expect(res.body.data).to.have.property('name').eq(newName);
                    expect(res.body.data).to.have.property('description').eq("React's component structure allows for quickly building a complex web application that relies on DOM manipulation.");
                    expect(res.body.data).to.have.property('created_at');
                    expect(res.body.data).to.have.property('updated_at');
                    done();
                });
        });

        it('should not update a deck that is not in the database', (done) => {
            const deckId = 1000;
            const newName = "Rendering with React";
            const newData = {
                "data": {
                    "name": newName
                }
            };
            chai.request(app)
                .put('/decks/' + deckId)
                .send(newData)
                .end((err, res) => {
                    expect(res.status).to.equal(404)
                    expect(res.error.text).to.have.string(`not found`);
                    done();
                });
        });

        it('should not update a deck with an invalid property', (done) => {
            const deckId = 1;
            const newData = {
                "data": {
                    "invalidProperty": "abcde"
                }
            };
            chai.request(app)
                .put('/decks/' + deckId)
                .send(newData)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.error.text).to.have.string(`Invalid field`);
                    done()
                });
        });

        it('should not change the id value of a deck', (done) => {
            const deckId = 1;
            const newValue = 22;
            const newData = {
                "data": {
                    "id": newValue
                }
            };
            chai.request(app)
                .put('/decks/' + deckId)
                .send(newData)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.data).to.have.property('id').eq(deckId);
                    done();
                });
        });
    });
});