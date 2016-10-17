var exec = require('child_process').exec;
var npmInstall = 'npm init --yes && npm install connect@3.5.0 serve-static@1.11.1 open@0.0.3 --save';

exec(npmInstall, function(error, stdout, stderr) {
  if (stdout) console.log(stdout);
  if (stderr) console.log(stderr);

  if (!error) {
    var connect = require('connect');
    var open = require('open');
    var serveStatic = require('serve-static');

    connect()
    .use(serveStatic(process.cwd()))
    .listen(8888, function() {
      console.log('Server running on 8888...');
      open("http://localhost:8888/sample.htm");
    });
  }
});
