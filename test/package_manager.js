'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const mockFs = require('mock-fs');
const fs = require('fs');
const packageManager = require('../lib/package_manager');

describe('PackageManager', () => {

  before(() => {
    chai.use(chaiAsPromised);
    chai.should();
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should be ok', () => {
    packageManager.should.be.ok;
  });

  describe('createPackageArchive', () => {

    /*it('compress source directory into a single .zip file', () => {
      mockFs({
        sourcePath: {
          file1: 'data1',
          file2: 'data2'
        },
        destPath: {}
      });
      return packageManager.createPackageArchive('sourcePath', 'destPath', 'archiveName')
      .then(() => {
        fs.statSync('archiveName.zip');
      });
    });*/

  });

});
