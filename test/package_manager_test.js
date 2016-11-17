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

  describe('bundleResources', () => {

    it('should follow manifest instructions and bundle and copy files accordingly', () => {
      mockFs({
        sourcePath: {
          'script1.min.js': 'data1',
          'script2.min.js': 'data2',
          'stylesheet1.css': 'data3',
          subPath: {
            'script3.min.js': 'data4',
            'image1.png': 'data5',
          }
        },
        destPath: {}
      });
      const manifest = {
        bundledResources: [
          createMockResource('', 'script1.min.js'),
          createMockResource('', 'script2.min.js'),
          createMockResource('subPath', 'script3.min.js')
        ],
        unbundledResources: [
          createMockResource('', 'stylesheet1.css'),
          createMockResource('subPath', 'image1.png')
        ]
      };

      return packageManager.bundleResources('sourcePath', { path: 'destPath', fileName: 'bundle.js' }, manifest)
      .then((packagedResources) => {
        expect(packagedResources.length).to.equal(3);
        packagedResources.forEach((resource) =>
          expect(fs.existsSync(path.join('destPath', resource.path, resource.fileName))).to.be.true
        );
      });
    });

    it('should override resource\'s destination folder when bundlePath is set', () => {
      mockFs({
        sourcePath: { 'script1.min.js': 'data1' },
        destPath: {}
      });
      const specialCopyResource = createMockResource('', 'script1.min.js');
      specialCopyResource.bundlePath = 'bundlePath';
      const manifest = {
        bundledResources: [],
        unbundledResources: [specialCopyResource]
      };

      return packageManager.bundleResources('sourcePath', { path: 'destPath', fileName: 'bundle.js' }, manifest)
      .then(() => {
        expect(fs.existsSync(path.join('destPath', 'bundlePath', 'script1.min.js'))).to.be.true
      });
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
