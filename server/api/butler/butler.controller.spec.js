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

 describe('Butler Allocation', () => {

    it('It Should create a Request', function(done) {
       chai.request(server)
                .post('/api/butler/request/create')
                .send({clientId: 1,requestId: "xyz",hours: 6})
                .end(function(error, response) {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    done();
                })
    });

    it('It Should return Butler Allocation Information', function(done) {
       chai.request(server)
                .get('/api/butler/allocateAndReport')
                .end(function(error, response) {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    done();
                })
    });
});
 
});



