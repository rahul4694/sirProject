'use strict';
'use strict';

var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server;
let should = chai.should();
chai.use(chaiHttp);

//Our parent block
describe('CSV ORDER', () => {
    beforeEach(() => { //Before each test run the server
        server = require('../../app');       
    });
    /*
     * Test the /GET route
     */
    describe('GET order with pagination', () => {

        //Getting All Orders List
        it('it should GET all the orders', (done) => {
          chai.request(server)
                .post('/api/order')
                .send({ where: {}, page: 1, limit: 30 })
                .end(function(error, response) {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    done();
                })
        });

         // Importing CSV File with Valid File Extension
        it('import CSV File with valid File Extension', (done) => {
            chai.request(server)
                .post('/api/order/import')
                .send({ "url": "http://localhost:3000/assets/file/file.csv" })
                .end(function(error, response) {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    done();
                });
        });

        // Importing CSV File with Valid File Extension
        it('import CSV File with Invalid File Extension', (done) => {
            chai.request(server)
                .post('/api/order/import')
                .send({ "url": "http://localhost:3000/assets/file/file.png" })
                .end(function(error, response) {
                    response.should.have.status(422);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    done();
                });
        });
    });

});