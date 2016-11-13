'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const config = require('../config/main');
const versionManager = require('../lib/version_manager');

describe('VersionManager', () => {
  let scope = null;

  before(() => {
    chai.use(chaiAsPromised);
    chai.should();
    scope = nock(config.RESOURCE_ROOT);
  });

  it('should be ok', () => {
    versionManager.should.be.ok;
  });

  describe('validatePlayerVersion', () => {

    it('should resolve promise when head request returns 200 status', () => {
      scope
      .head(`/stable/latest/${config.VERSION_CHECK_ASSET}`)
      .reply(200);
      return versionManager.validatePlayerVersion('latest', 'stable').should.be.fulfilled;
    });

    it('should reject promise when head request returns a status different from 200', () => {
      scope
      .head(`/stable/latest/${config.VERSION_CHECK_ASSET}`)
      .reply(404);
      return versionManager.validatePlayerVersion('latest', 'stable').should.be.rejected;
    });

  });

  describe('resolveVersionNumber', () => {

    it('should resolve same version number when passing a valid semver in version param', () => {
      return versionManager.resolveVersionNumber('4.8.1', 'stable').should.eventually.equal('4.8.1');
    });

    it('should resolve version number when passing "latest" in version param', () => {
      scope
      .get(`/stable/latest/${config.VERSION_FILE}`)
      .reply(200, 'Version: 4.8.8\nmjolnir latest commit: 796778274824b347eb703933c94ac0861292e621');
      return versionManager.resolveVersionNumber('latest', 'stable').should.eventually.equal('4.8.8');
    });

    it('should reject the promise when version info from server is unparseable', () => {
      scope
      .get(`/stable/latest/${config.VERSION_FILE}`)
      .reply(200, 'Version: garbled mess\nmjolnir latest commit: 796778274824b347eb703933c94ac0861292e621');
      return versionManager.resolveVersionNumber('latest', 'stable').should.be.rejected;
    });

    it('should reject the promise when version info from server can\'t be obtained', () => {
      scope
      .get(`/stable/latest/${config.VERSION_FILE}`)
      .reply(401);
      return versionManager.resolveVersionNumber('latest', 'stable').should.be.rejected;
    });

  });

});
