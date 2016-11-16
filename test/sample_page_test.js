'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const mockFs = require('mock-fs');
const fs = require('fs');
const config = require('../config/main');
const samplePage = require('../lib/sample_page');

const mockResources = [
  {
    path: 'p1',
    fileName: 'r1.json',
    url: `${config.RESOURCE_ROOT}/p1/r1.json`
  },
  {
    path: 'p1',
    fileName: 'r1.js',
    url: `${config.RESOURCE_ROOT}/p1/r1.js`
  },
  {
    path: 'p1',
    fileName: 'r1.css',
    url: `${config.RESOURCE_ROOT}/p1/r1.css`
  },
  {
    path: 'p2',
    fileName: 'r2.js',
    url: `${config.RESOURCE_ROOT}/p2/r2.js`
  }
];

describe('SamplePage', () => {

  before(() => {
    chai.use(chaiAsPromised);
    chai.should();
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should be ok', () => {
    expect(samplePage).to.be.ok;
  });

  describe('create', () => {

    it('should create a basic sample page', () => {
      mockFs({
        'templates/index.pug': 'doctype html',
        'destPath': {}
      });
      return samplePage.create('destPath', 'fileName', [], {})
      .then(() => {
        expect(fs.readFileSync('destPath/fileName', 'utf8')).to.equal('<!DOCTYPE html>');
      });
    });

    it('should render resources by type in order specified by template', () => {
      mockFs({
        'templates/index.pug':
          'doctype html\nbody' +
          '\n  each scriptUrl in scripts\n    | #{scriptUrl}-' +
          '\n  each styleSheetUrl in styleSheets\n    | #{styleSheetUrl}-' +
          '\n  each jsonUrl in json\n    | #{jsonUrl}-',
        'destPath': {}
      });
      return samplePage.create('destPath', 'fileName', mockResources, {})
      .then(() => {
        expect(fs.readFileSync('destPath/fileName', 'utf8')).to.equal(
          '<!DOCTYPE html>\n<body>p1/r1.js-p2/r2.js-p1/r1.css-p1/r1.json-\n</body>'
        );
      });
    });

  });

});
