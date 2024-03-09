# Payroll Loans





## Tools

The application follows the principles of SOLID.

</br>

## Technical Decisions


</br>


## Environment variables

To use the application, you will need to configure the environment variables.

Rename the project root `.env.example` file to `.env`. This file contains all the variables necessary to launch the application.

⚠️ **Important** ⚠️

You must replace the file information with your database credentials. Furthermore, in the `DB_HOST` variable you will need to enter `localhost` to run the project **locally**.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Database

The application uses the MySQL database. Make sure you have it installed on your computer, or create a Docker container. The application has the necessary scripts to create or delete the database.

_**When starting the application, the database will be created automatically.**_

### Creation of the bank

Run the `npm run db:create` script to create your database.
To delete the database, run `npm run db:drop`.

### Migrations

You can run migrations with the command `npm run migration:run` or revert them with `npm run migration:revert`.


## API

With the application running, access the [API documentation](http://localhost:3000/docs/) to see the available routes and the data expected in each request. </br>
 
 ---

Project developed by [Thais R Kotovicz](https://www.linkedin.com/in/thaiskotovicz/).
</br>

