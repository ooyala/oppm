'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const mockFs = require('mock-fs');
const fs = require('fs');
const path = require('path');
const utils = require('../lib/utils');

describe('Utils', () => {

  describe('copyFiles', () => {

    afterEach(() => {
      mockFs.restore();
    });

    it('should copy files to the specified destination', () => {
      mockFs({
        sourcePath: {
          file1: 'data1',
          nestedPath: {
            file2: 'data2'
          }
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

  });

});
