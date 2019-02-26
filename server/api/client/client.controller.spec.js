'use strict';

var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server;
let should = chai.should();
chai.use(chaiHttp);

//Our parent block
describe('CSV CLIENT', () => {
    beforeEach(() => { //Before each test run the server
        server = require('../../app');       
    });
    /*
     * Test the /GET route
     */
    describe('GET client with pagination', () => {

        //Getting All Clients List
        it('it should GET all the Clients List', (done) => {
          chai.request(server)
                .post('/api/client')
                .send({ where: {}, page: 1, limit: 30 })
                .end(function(error, response) {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    done();
                })
        });

         // Creating a Client
        it('it should create a Client', (done) => {
            chai.request(server)
                .post('/api/client/create')
                .send({ "firstName": "test", "lastName": "name" })
                .end(function(error, response) {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    done();
                });
        });

    });

});