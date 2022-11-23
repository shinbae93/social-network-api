const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiAsPromise = require("chai-as-promised");
const lodash = require('lodash')
const { UseManager } = require('../services/UserManager');
const { describe, it } = require('mocha');
// Assertion style
chai.should();

chai.use(chaiHttp);
chai.use(chaiAsPromise);

const assert = chai.assert;

//
describe('', function () {
  describe('function getUsers()', () => {
    it('Return OK', async () => {
      
    });
  });
});
