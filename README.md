# Payroll Loans


The application simulates a payroll loan system.
Applying for this type of loan works as follows:
1. Partnership between Company and Creditit:
A company establishes a partnership with Credifit to offer financial benefits to its employees, such as a payroll loan.
2. Loan Request: Employees of the partner company access the Credifit application to request a loan.
3. Validation of Available Margin: Credifit checks the employee's available margin for payroll, which cannot exceed 35% of their salary. It then shows the user the maximum amount they can request and the number of possible installments.
4. Minimum Score Validation: Credifit checks whether the user has a minimum score to be able to request, according to internal business rules.
5. Loan Granting: If the user's score is above the minimum, Credifit grants the loan to the employee.
6. Discount on Payroll: Credifit coordinates with the partner company to discount the loan installment directly on the employee's payroll.



## Tools

RESTFull API built using NestJS. The database chosen was MySQL, together with TypeORM. The unit tests were done with Jest and the E2E tests were done with Supertest. API documentation was done with Swagger. The application follows the principles of SOLID.
</br>

## Technical Decisions

**Development Framework, Architecture, and Testing Approach:**
The project uses NestJS as the primary framework due to its robustness, modularity, and ease of use. It follows NestJS's suggested architectural pattern, organizing modules, services, controllers, and middlewares for enhanced code organization and maintenance.

**Data Handling and Validation:**
TypeORM is used to interact with the MySQL database, providing an abstraction layer over pure SQL. Entities such as EmployeeEntity, CompanyEntity, and LoanEntity are defined to represent business concepts, with TypeORM annotations mapping these entities to database tables. Relationships between entities, ensure proper data structure representation and association establishment. Data validation is implemented at the application level to ensure data integrity, including format validations, uniqueness, and business constraints.

**Testing and Error Handling:**
Jest serves as the testing framework with Supertest for integration tests, offering support for mocks, spies, and assertions. Exception handling is utilized to manage errors and unexpected scenarios, providing a consistent user experience with informative error messages.

**Monitoring:**
Logging is incorporated to record crucial information during execution, facilitating problem diagnosis and flow tracking.

</br>


## Environment variables

To use the application, you will need to configure the environment variables.
Rename the project root `.env.example` file to `.env`. This file contains all the variables necessary to launch the application.

⚠️ **Important**
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

Run the `npm run db:create` script to create your database. To delete the database, run `npm run db:drop`.

You can run migrations with the command `npm run migration:run` or revert them with `npm run migration:revert`.


## API

With the application running, access the [API documentation](http://localhost:3000/docs/) to see the available routes and the data expected in each request. </br>
 
 ---

Project developed by [Thais R Kotovicz](https://www.linkedin.com/in/thaiskotovicz/).
</br>
