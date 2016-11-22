'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const mockFs = require('mock-fs');
const fs = require('fs-extra');
const path = require('path');
const pluginUtils = require('../lib/plugin_utils');

describe('PluginUtils', () => {

  before(() => {
    chai.use(chaiAsPromised);
    chai.should();
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should be ok', () => {
    expect(pluginUtils).to.be.ok;
  });

  describe('relativizeAssetUrl', () => {

    it('should replace absolute urls inside a file', () => {
      const originalFile = `{
        "imageResource": "//player.ooyala.com/static/v4/candidate/latest/skin-plugin/assets/images/loader_svg.svg"
        "fancyFont": "http://player.ooyala.com/static/v4/stable/4.9.8/skin-plugin/assets/fonts/ooyala-slick-type.woff"
      }`;
      const modifiedFile = `{
        "imageResource": "skin-plugin/assets/images/loader_svg.svg"
        "fancyFont": "skin-plugin/assets/fonts/ooyala-slick-type.woff"
      }`;
      const skinDependencies = [
        {
          path: 'skin-plugin/assets/images',
          fileName: 'loader_svg.svg'
        },
        {
          path: 'skin-plugin/assets/fonts',
          fileName: 'ooyala-slick-type.woff'
        }
      ];
      const filePath = path.join('sourcePath', 'test.json');
      mockFs({
        sourcePath: {
          'test.json': originalFile,
        }
      });

      return pluginUtils.relativizeSkinJsonUrls(filePath, skinDependencies)
      .then(() => {
        expect(fs.readFileSync(filePath, 'utf8')).to.equal(modifiedFile);
      });
    });

    it('should reject the promise when an error occurs', () => {
      mockFs({});
      return pluginUtils.relativizeSkinJsonUrls('nonExistentFile', []).should.be.rejected;
    });

  });

});
