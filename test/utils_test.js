'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const mockFs = require('mock-fs');
const fs = require('fs');
const path = require('path');
const utils = require('../lib/utils');

describe('Utils', () => {

  before(() => {
    chai.use(chaiAsPromised);
    chai.should();
  });

  it('should be ok', () => {
    expect(utils).to.be.ok;
  });

  describe('concatFiles', () => {

    afterEach(() => {
      mockFs.restore();
    });

    it('should concatenate files into a single bundle', () => {
      mockFs({
        sourcePath: {
          file1: 'data1',
          nestedPath: { file2: 'data2' },
          file3: 'data3',
        },
        destPath: {}
      });
      const files= [
        path.join('sourcePath', 'file1'),
        path.join('sourcePath', 'nestedPath', 'file2'),
        path.join('sourcePath', 'file3')
      ];
      const bundleFilePath = path.join('destPath', 'bundle');
      return utils.concatFiles(bundleFilePath, files)
      .then(() => {
        expect(fs.readFileSync(bundleFilePath, { encoding: 'utf8' })).to.equal('data1\r\ndata2\r\ndata3\r\n');
      });
    });

    it('should reject the promise when an error occurs', () => {
      mockFs({
        sourcePath: {
          file1: 'data1',
        }
      });
      const files= [
        path.join('sourcePath', 'file1'),
        path.join('sourcePath', 'file2')
      ];
      return utils.concatFiles(path.join('destPath', 'bundle'), files).should.be.rejected;
    });

  });

  describe('copyFiles', () => {

    afterEach(() => {
      mockFs.restore();
    });

    it('should copy files to the specified destination', () => {
      mockFs({
        sourcePath: {
          file1: 'data1',
          nestedPath: { file2: 'data2' }
        },
        destPath: {}
      });
      const files = [
        {
          src: path.join('sourcePath', 'file1'),
          dest: path.join('destPath', 'file1')
        },
        {
          src: path.join('sourcePath', 'nestedPath', 'file2'),
          dest: path.join('destPath', 'nestedPath', 'file2')
        }
      ];
      return utils.copyFiles(files)
      .then(() => {
        expect(fs.existsSync(files[0].dest)).to.be.true;
        expect(fs.existsSync(files[1].dest)).to.be.true;
      });
    });

    it('should reject the promise when an error occurs', () => {
      mockFs({
        sourcePath: {
          file1: 'data1'
        }
      });
      const files = [
        {
          src: path.join('sourcePath', 'file2'),
          dest: path.join('destPath', 'file1')
        }
      ];
      return utils.copyFiles(files).should.be.rejected;
    });

  });

});
