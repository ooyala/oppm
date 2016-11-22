'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const mockFs = require('mock-fs');
const fs = require('fs');
const expect = chai.expect;
const config = require('../config/main');
const resourceManager = require('../lib/resource_manager');

const mockResources = [
  {
    path: '',
    fileName: 'resource0.txt',
    url: `${config.RESOURCE_ROOT}/resource0.txt`
  },
  {
    path: 'subPath1',
    fileName: 'resource1.txt',
    url: `${config.RESOURCE_ROOT}/subPath1/resource1.txt`
  },
  {
    path: 'subPath2',
    fileName: 'resource2.txt',
    url: `${config.RESOURCE_ROOT}/subPath2/resource2.txt`
  }
];

const createMockPlugin = (id, pluginPath, extension) => ({
  id: id,
  name: id,
  path: pluginPath || '',
  fileName: `${id}${extension || '.js'}`,
  dependencies: []
});

const createMockDependency = (fileName, dependencyPath) => ({
  path: dependencyPath || '',
  fileName: fileName,
});

const createMockPluginGroup = (id, pluginPath) => ({
  dependencies: [],
  plugins: [createMockPlugin(id, pluginPath)]
});

describe('ResourceManager', () => {

  before(() => {
    chai.use(chaiAsPromised);
    chai.should();
  });

  it('should be ok', () => {
    expect(resourceManager).to.be.ok;
  });

  describe('filterPluginResources', () => {
    let plugins = null;
    let filters = null;

    beforeEach(() => {
      plugins = {
        corePlugins: createMockPluginGroup('core'),
        videoPlugins: createMockPluginGroup('video'),
        otherPlugins: createMockPluginGroup('other'),
        skinPlugins: createMockPluginGroup('skin'),
        adPlugins: createMockPluginGroup('ad'),
        analyticsPlugins: createMockPluginGroup('analytics')
      };
      filters = {
        core: [],
        video: [],
        other: [],
        skin: [],
        ad: [],
        analytics: []
      };
    });

    it('should filter resources of selected plugins', () => {
      filters.video = ['video'];
      filters.analytics = ['analytics'];

      const filteredResources = resourceManager.filterPluginResources(plugins, '4.8.1', 'stable', filters);
      expect(filteredResources.length).to.equal(3);
      expect(filteredResources[0].fileName).to.equal('core.js'); // Core is always included
      expect(filteredResources[1].fileName).to.equal('video.js');
      expect(filteredResources[2].fileName).to.equal('analytics.js');
    });

    it('should include dependencies first', () => {
      plugins.videoPlugins.dependencies.push(createMockDependency('dep1.js'));
      plugins.skinPlugins.plugins[0].dependencies.push(createMockDependency('dep2.js'));
      filters.video = ['video'];
      filters.skin = ['skin'];

      const filteredResources = resourceManager.filterPluginResources(plugins, '4.8.1', 'stable', filters);
      expect(filteredResources.length).to.equal(5);
      expect(filteredResources[0].fileName).to.equal('core.js')
      expect(filteredResources[1].fileName).to.equal('dep1.js');
      expect(filteredResources[2].fileName).to.equal('video.js');
      expect(filteredResources[3].fileName).to.equal('dep2.js');
      expect(filteredResources[4].fileName).to.equal('skin.js');
    });

    it('should exclude or include resources depending on version restrictions', () => {
      plugins.videoPlugins.plugins[0].v4Version = '>=4.9.2';
      filters.video = ['video'];
      filters.skin = ['skin'];
      filters.analytics = ['analytics'];

      let filteredResources = resourceManager.filterPluginResources(plugins, '4.8.1', 'stable', filters);
      expect(filteredResources.some(resource => resource.fileName === 'video.js')).to.be.false;
      filteredResources = resourceManager.filterPluginResources(plugins, '4.9.3', 'stable', filters);
      expect(filteredResources.some(resource => resource.fileName === 'video.js')).to.be.true;
    });

  });

  describe('downloadResources', () => {
    let scope = null;

    before(() => {
      scope = nock(config.RESOURCE_ROOT);
    });

    beforeEach(() => {
      mockFs({
        'destPath': {}
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should download resources to the specified path and maintain resource directory structure', () => {
      scope
      .get('/resource0.txt')
      .reply(200, 'data0')
      .get('/subPath1/resource1.txt')
      .reply(200, 'data1')
      .get('/subPath2/resource2.txt')
      .reply(200, 'data2');

      return resourceManager.downloadResources(mockResources, 'destPath', false)
      .then(() => {
        expect(fs.readFileSync('destPath/subPath1/resource1.txt', 'utf8')).to.equal('data1');
        expect(fs.readFileSync('destPath/subPath2/resource2.txt', 'utf8')).to.equal('data2');
      });
    });

    it('should reject promise when a resource fails to download', () => {
      scope
      .get('/resource0.txt')
      .reply(200, 'data0')
      .get('/subPath1/resource1.txt')
      .reply(200, 'data1')
      .get('/subPath2/resource2.txt')
      .reply(401, 'Unauthorized');

      return resourceManager.downloadResources(mockResources, 'destPath', false).should.be.rejected;
    });

  });

  describe('buildRelativeResourcePath', () => {

    it('should build resource path correctly', () => {
      expect(resourceManager.buildRelativeResourcePath(mockResources[0])).to.equal('resource0.txt');
      expect(resourceManager.buildRelativeResourcePath(mockResources[1])).to.equal('subPath1/resource1.txt');
    })

    it('should use bundlePath when available', () => {
      const resource = {
        path: 'subPath1',
        bundlePath: '',
        fileName: 'resource1.txt',
        url: `${config.RESOURCE_ROOT}/subPath1/resource1.txt`
      };
      expect(resourceManager.buildRelativeResourcePath(resource, true)).to.equal('resource1.txt');
      expect(resourceManager.buildRelativeResourcePath(mockResources[1], true)).to.equal('subPath1/resource1.txt');
    });

  });

});
