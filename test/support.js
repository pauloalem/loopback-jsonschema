require('mocha-sinon')();

var chai = require('chai');
var sinonChai = require('sinon-chai');

var JsonSchema = require('../lib/models/json-schema');

chai.use(sinonChai);

afterEach(function() {
    JsonSchema.deleteAll(function(err) {
        if (err) { throw err };
    });
});
