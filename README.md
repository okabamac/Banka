# Banka
[![Build Status](https://travis-ci.org/okabamac/Banka.svg?branch=development)](https://travis-ci.org/okabamac/Banka) [![Coverage Status](https://coveralls.io/repos/github/okabamac/Banka/badge.svg?branch=coverall-fix)](https://coveralls.io/github/okabamac/Banka?branch=coverall-fix)

Banka is a lightweight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank., where users can signup,  and create bank acocunts online, but must visit the branch to withdraw or deposit money.

## Table of Content

- [Getting Started](#Getting-Started)
- [Technology Stack](#Technology-Stack)
- [Installation and Usage](#Installation-and-Usage)
- [Testing](#Testing)
- [Feature](#Features)
- [Routes for Express](#Routes-for-Express)
- [Models](#Models)
- [API Documentation](#API-Documentation)
- [License](#License)
- [FAQ](#FAQ)

## Getting Started
To run this application, you should have the following:
- Node
- NPM/Yarn (NPM comes with Node)

## Installation
The following commands enables you run the app:
- clone the repo: RUN THE COMMAND
```
>> git clone https://github.com/okabamac/banka.git
```
- Install the dependencies: RUN THE COMMAND
```shell
>> npm i 
```
- Start the server: RUN THE COMMAND
```
>> npm run start
```
- You should use ```localhost:3000``` as your base url

## Features

* User (client) can sign up.
* User (client) can login.
* User (client) can create an account.
* User (client) can view account transaction history.
* User (client) can view a specific account transaction.
* Staff (cashier) can debit user (client) account.
* Staff (cashier) can credit user (client) account.
* Admin/staff can view all user accounts.
* Admin/staff can view a specific user account.
* Admin/staff can activate or deactivate an account.
* Admin/staff can delete a specific user account.
* Admin can create staff and admin user accounts.


## Testing
To run the test USE the following command
```
>> npm run test
```
#### What does this test covers?
The test covers all the endpoints and requests sent to them.

## Deployments
This application was deployed to the following:
- [Heroku](https://banka-ch-api.herokuapp.com) : For API endpoints.
- [Github Pages](https://okabamac.github.io/Banka/) : UI template for this application.
- [Pivotal Tracker](https://www.pivotaltracker.com/n/projects/2319936) : Pivot Tracker stories
- [Swagger Documentation](https://banka-ch-api.herokuapp.com/api-docs) : Swagger Documentation

## API Endpoints
| METHOD   | DESCRIPTION                                  | ENDPOINTS                 
| ---------|----------------------------------------------| ------------------------------------------------| 
| POST     | User's Sign up                               | `/api/v1/auth/signup`                           |
| POST     | User's Sign in                               | `/api/v1/auth/signin`                           |
| POST      | Admin Add user                               | `/api/v1/auth/addUser`
| POST     | Create a bank account                        | `/api/v1/accounts`                              |   
| PATCH    | Activate or deactive an account              | `/api/v1/accounts/<accountNumber>`              | 
| DELETE   | Delete an account                            | `/api/v1/accounts/<accountNumber>`              |
| POST     | Perform a debit transaction                  | `/api/v1/transactions/<accountNumber>/debit`    |
| POST     | Perform a credit transaction                 | `/api/v1/transactions/<accountNumber>/credit`   |
| GET      | View an account's transaction history        | `/api/v1/accounts/<accountNumber>/transactions` |
| GET      | View all account's owned by a specific user  | `/api/v1/user/<email>/accounts`                 |
| GET      | View a specific transaction                  | `/api/v1/transactions/<transactionId>`          |
| GET      | View a specific account                      | `/api/v1/accounts/<accountNumber>`              |
| GET      | View all accounts                            | `/api/v1/accounts`                              |
| GET      | View all active bank accounts                | `/api/v1/accounts?status=active`                |
| GET      | View all dormant bank accounts               | `/api/v1/accounts?status=dormant`               |


## Author
Okaba Mark

## License
[Andela](https://www.andela.com)
