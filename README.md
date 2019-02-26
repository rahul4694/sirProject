# Node Todo App

A Node app built with MongoDB, Mocha and swagger. For demonstration purposes only.

Node provides the RESTful API. 
Swagger for API documentation. 
MongoDB to store data.
Mocha and Chai for testing node API

## Requirements

- [Node and npm](http://nodejs.org)
- MongoDB: Make sure you have your own local or remote MongoDB database URI configured in `config/connection.js`

## Installation

1. Clone the repository
2. Install the application: `npm install`
3. Edit env file according to your configuration(if required) `.env`
3. Start the server: `node server/app.js`
4. View in browser at `http://localhost:3000`
5. To run test: `npm test`

## Application comprise of two module : 
# CSV DataImport Module Feature 
- Contain list of client in `client collection`.
- Import request from CSV file URL into `order collection`.
- Only import request of clients(present in client collection).
- Check CSV file url validation.
- Check the data format of CSV.

# Assign Request To Butler Module Feature
- Contain list of request in `request collection`.
- Allocates requests to butlers.
- Each individual client should be allocated to one butler as much as possible.
- Each butler has a maximum of 8 working hours.
