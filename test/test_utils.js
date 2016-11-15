
const patchMockFs = (fs) => {
  const createWriteStream = fs.createWriteStream;

  fs.createWriteStream = function() {
    const stream = createWriteStream.apply(this, arguments);

    if (!stream.on) {
      stream.on = (event, callback) => callback();
    }
    return stream;
  };
  return fs;
}

exports.patchMockFs = patchMockFs;
