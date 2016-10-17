'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const mockFs = require('mock-fs');
const fs = require('fs');
const expect = chai.expect;
const config = require('../config/main');
const resourceManager = require('../lib/resource_manager');

const mockResources = [
  {
    path: 'subPath1',
    fileName: 'resource1.txt',
    url: `${config.RESOURCE_ROOT}/subPath1/resource1.txt`
  },
  {
    path: 'subPath2',
    fileName: 'resource2.txt',
    url: `${config.RESOURCE_ROOT}/subPath2/resource2.txt`
  }
];

describe('ResourceManager', () => {
  let scope = null;

  before(() => {
    chai.use(chaiAsPromised);
    chai.should();
    scope = nock(config.RESOURCE_ROOT);
  });

  it('should be ok', () => {
    expect(resourceManager).to.be.ok;
  });

  describe('downloadResources', () => {

    beforeEach(() => {
      mockFs({
        'destPath': {}
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should download resources to the specified path and maintain resource directory structure', () => {
      scope
      .get('/subPath1/resource1.txt')
      .reply(200, 'data1')
      .get('/subPath2/resource2.txt')
      .reply(200, 'data2');

      return resourceManager.downloadResources(mockResources, 'destPath', false)
      .then(() => {
        expect(fs.readFileSync('destPath/subPath1/resource1.txt', 'utf8')).to.equal('data1');
        expect(fs.readFileSync('destPath/subPath2/resource2.txt', 'utf8')).to.equal('data2');
      });
    });

    it('should reject promise when a resource fails to download', () => {
      scope
      .get('/subPath1/resource1.txt')
      .reply(200, 'data1')
      .get('/subPath2/resource2.txt')
      .reply(401, 'Unauthorized');

      return resourceManager.downloadResources(mockResources, 'destPath', false).should.be.rejected;
    });

  });

});
