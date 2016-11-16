'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const mockFs = require('mock-fs');
const fs = require('fs-extra');
const path = require('path');
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
    expect(packageManager).to.be.ok;
  });

  describe('createPackageArchive', () => {

    it('compress source directory into a single .zip file', () => {
      mockFs({
        sourcePath: {
          file1: 'data1',
          file2: 'data2'
        },
        destPath: {}
      });
      return packageManager.createPackageArchive('sourcePath', 'destPath', 'archiveName')
      .then(() => {
        fs.existsSync(path.join('destPath', 'archiveName.zip')).should.be.true;
      });
    });

    it('should reject the promise when an error occurs', () => {
      mockFs({});
      return packageManager.createPackageArchive('sourcePath', 'destPath', 'archiveName').should.be.rejected;
    });

  });

});
