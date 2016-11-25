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

  describe('extractPackageOptions', () => {

    it('should include main_html5 when FreeWheel or Ad Manager Vast are selected', () => {
      const opts1 = pluginUtils.extractPackageOptions({ video: ['bit-wrapper'], ad: ['freewheel'] });
      const opts2 = pluginUtils.extractPackageOptions({ video: ['bit-wrapper', 'akamai-hd-flash'], ad: ['ad-manager-vast'] });

      expect(opts1.video.some(plugin => plugin === 'main-html5')).to.be.true;
      expect(opts2.video.some(plugin => plugin === 'main-html5')).to.be.true;
    });

    it('should only include main_html5 once when multiple conditions require it', () => {
      const opts1 = pluginUtils.extractPackageOptions({ video: ['main-html5', ['main-html5', 'bit-wrapper']] });
      const opts2 = pluginUtils.extractPackageOptions({ video: ['main-html5'], ad: ['freewheel'] });

      expect(opts1.video.reduce((count, plugin) =>
        count + (plugin === 'main-html5' ? 1 : 0)
      , 0)).to.equal(1);
      expect(opts2.video.reduce((count, plugin) =>
        count + (plugin === 'main-html5' ? 1 : 0)
      , 0)).to.equal(1);
    });

    it('should merge iframe with skin options', () => {
      const opts = pluginUtils.extractPackageOptions({ skin: ['html5-skin', 'skin-json'], iframe: ['html-iframe'] });

      expect(opts.iframe).to.be.undefined;
      expect(opts.skin).to.eql(['html5-skin', 'skin-json', 'html-iframe']);
    });

    it ('should not duplicate video options', () => {
      const opts = pluginUtils.extractPackageOptions({ video: ['main-html5', ['main-html5', 'bit-wrapper'], 'bit-wrapper'] });
      expect(opts.video).to.eql(['main-html5', 'bit-wrapper']);
    });

    it ('should include main_html5 first', () => {
      const opts1 = pluginUtils.extractPackageOptions({
        video: ['bit-wrapper', ['main-html5', 'bit-wrapper'], 'main-html5']
      });
      const opts2 = pluginUtils.extractPackageOptions({ video: ['osmf-flash'], ad: ['freewheel'] });

      expect(opts1.video[0]).to.equal('main-html5');
      expect(opts2.video[0]).to.equal('main-html5');
    });

  });

});
