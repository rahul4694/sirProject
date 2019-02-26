'use strict';

var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server;
let should = chai.should();
chai.use(chaiHttp);

//Our parent block
describe('Books', () => {
    beforeEach(() => { //Before each test we empty the database
        server = require('../../app');
        // server.body.should.be.a('object');
       
    });
    /*
     * Test the /GET route
     */
    describe('/GET Client List', () => {

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