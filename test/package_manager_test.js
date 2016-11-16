'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const mockFs = require('mock-fs');
const fs = require('fs-extra');
const path = require('path');
const packageManager = require('../lib/package_manager');

const createMockResource = (resourcePath, fileName) => ({
  path: resourcePath,
  fileName: fileName,
  url: `http://foo.bar/${resourcePath}/${fileName}`
});

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

  describe('generateManifest', () => {

    it('should correctly separate bundled and unbundled resources', () => {
      const resources = [
        createMockResource('path', 'script1.min.js'),
        createMockResource('path', 'stylesheet1.css'),
        createMockResource('path', 'script2.js'),
        createMockResource('path', 'script3.min.js'),
        createMockResource('path', 'image1.png')
      ];
      const manifest = packageManager.generateManifest('4.8.1', resources);
      expect(manifest.bundledResources).to.eql([
        createMockResource('path', 'script1.min.js'),
        createMockResource('path', 'script2.js'),
        createMockResource('path', 'script3.min.js')
      ]);
      expect(manifest.unbundledResources).to.eql([
        createMockResource('path', 'stylesheet1.css'),
        createMockResource('path', 'image1.png')
      ]);
    });

    it('should not bundle resources that don\'t satisify version criteria', () => {
      const unbundleableResource1 = createMockResource('path', 'script2.js');
      const unbundleableResource2 = createMockResource('path', 'script3.js');
      unbundleableResource1.bundleableV4Version = '>=4.9.2';
      unbundleableResource2.bundleableV4Version = 'none';
      const resources = [
        createMockResource('path', 'script1.min.js'),
        unbundleableResource1,
        unbundleableResource2
      ];
      const manifest = packageManager.generateManifest('4.8.1', resources);
      expect(manifest.bundledResources).to.eql([
        createMockResource('path', 'script1.min.js')
      ]);
    });

  });

  describe('createPackageArchive', () => {

    it('should compress source directory into a single .zip file', () => {
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
