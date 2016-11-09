const semver = require('semver');
const path = require('path');
const untildify = require('untildify');

exports.wizardQuestions = (version) => {
  const questions = [
    {
      type: 'checkbox',
      name: 'video',
      message: 'What Streaming Formats do you want to support?',
      choices: [
        { name: 'MP4', value: 'main-html5', checked: true },
        { name: 'HLS', value: 'bit-wrapper' },
        { name: 'DASH', value: 'bit-wrapper' },
        { name: 'HDS', value: 'osmf-flash' },
        { name: 'HDS (Akamai)', value: 'akamai-hd-flash' }
      ],
      validate: userInput => (userInput.length ? true : 'Please choose at least one format.')
    },
    {
      type: 'checkbox',
      name: 'ad',
      message: 'What Advertising Platform(s) do you want to utilize?',
      choices: [
        { name: 'VAST 2.0 & 3.0 / VPAID 2.0 / VMAP 1.0', value: 'ad-manager-vast' },
        { name: 'Pulse', value: 'pulse' },
        { name: 'Pulse SSAI', value: 'ssai-pulse' },
        { name: 'Google IMA (Ad Rules / VAST 2.0 & 3.0 / VPAID 1.0 & 2.0)', value: 'google-ima' },
        { name: 'FreeWheel', value: 'freewheel' }
      ]
    },
    {
      type: 'checkbox',
      name: 'analytics',
      message: 'What Analytics Package(s) do you want to use?',
      choices: [
        { name: 'Ooyala IQ', value: 'iq', disabled: 'Included' },
        { name: 'Google Analytics', value: 'google-analytics', v4Version: '>=4.7.0' },
        { name: 'Nielsen Analytics', value: 'nielsen-analytics' },
        { name: 'Conviva', value: 'conviva' },
        { name: 'Adobe Omniture', value: 'omniture' },
        { name: 'comScore', value: 'iq', disabled: 'Please contact your Ooyala account manager' },
        { name: 'YOUBORA', value: 'iq', disabled: 'Self Hosting not recommended' }
      ]
    },
    {
      type: 'list',
      name: 'skin',
      message: 'Do you want to include the default Ooyala player skin?',
      choices: [
        { name: 'YES - Include the default skin in my package.', short: 'Yes', value: ['html5-skin', 'skin-json'] },
        { name: 'NO - I would like to use my own skin.', short: 'No', value: ['html5-skin'] }
      ]
    },
    {
      type: 'list',
      name: 'other',
      message: 'Do you want to include the Discovery plugin?',
      choices: [
        { name: 'YES - (Discovery feature must be enabled on your account)', short: 'Yes', value: ['discovery'] },
        { name: 'NO - Don\'t include Discovery functionality', short: 'No', value: [] }
      ],
      default: 1
    },
    {
      type: 'list',
      name: 'bundle',
      message: 'Do you want to bundle scripts and styles into a single file?',
      choices: [
        { name: 'YES - Bundle as many files as possible.', short: 'Yes', value: true },
        { name: 'NO - Keep files separate.', short: 'No', value: false }
      ],
      default: 0
    },
    {
      type: 'input',
      name: 'outputPath',
      message: 'Enter a destination folder path for the .zip package:',
      // default: process.cwd(),
      default: path.join(process.cwd(), 'dist'), // TODO - Remove, only for dev
      filter: outputPath => untildify(path.normalize(outputPath))
    }
  ];

  // Filter out options that are not available on the given version
  const filteredQuestions = questions.map((question) => {
    if (question.choices) {
      question.choices = question.choices.filter((choice) => {  // eslint-disable-line no-param-reassign
        if (choice.v4Version && !semver.satisfies(version, choice.v4Version)) {
          return false;
        }
        return true;
      });
    }
    return question;
  });

  return filteredQuestions;
};

exports.downloadFailedQuestions = fileName =>
  [
    {
      type: 'list',
      name: 'download-failed',
      message: `File "${fileName}" could not be downloaded at this time.\nWhat would you like to do?`,
      choices: [
        { name: 'Retry download', short: 'Retry', value: 'retry' },
        { name: 'Skip this file', short: 'Skip', value: 'skip' },
        { name: 'Abort package manager', short: 'Abort', value: 'abort' }
      ]
    }
  ];
