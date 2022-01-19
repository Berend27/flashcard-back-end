# flashcard-back-end
## Back End Component to flashcard-o-matic

### Deployed Back End
[https://flashcard-back-end-djb.herokuapp.com](https://flashcard-back-end-djb.herokuapp.com/)

Sample of an API Response (route: /decks/2?_embed=cards)
<img width="966" alt="flashcard-back-end-screenshot" src="https://user-images.githubusercontent.com/42151098/150194874-3e6341ca-f47c-4015-bd66-9beb0e9a6b0b.png">

### Deployed Front End
[https://flashcard-o-matic-xi.vercel.app](https://flashcard-o-matic-xi.vercel.app/)

## Installation
1. Fork and clone this repository.
2. Run `cp .env.sample .env`
3. Create three databases, one for development, one for production, and one for test. Add the respective URLs to the .env file.
4. `npm install`
5. Run migrations and seed the database. `npx knex migrate:latest` and then `npx knex seed:run`
6. Run `npm run start:dev` to start the server in the development environment.

## Routes
1. /decks
  * /
  * /:deckId
  * /:deckId?_embed=cards
2. /cards
  * /
  * /?deckId=
  * /:cardId

## Completed Learning Objectives
1. Built an API from scratch using Express.js and Knex.js
2. Created and worked with PostgreSQL databases
3. Deployed an app to production with Heroku
4. Wrote unit tests with Mocha, Chai, and Chai HTTP

## Technologies
* Chai
* Chai HTTP
* Dotenv
* ElephantSQL
* Express.js
* Heroku
* JavaScript
* Knex.js
* Mocha
* Node.js
* PostgreSQL
