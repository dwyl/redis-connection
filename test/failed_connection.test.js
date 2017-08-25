// See: github.com/dwyl/redis-connection/issues/38
var dir  = __dirname.split('/')[__dirname.split('/').length-1];
var file = dir + __filename.replace(__dirname, '') + " > ";
var test = require('tape');
var decache = require('decache'); // http://goo.gl/JIjK9Y

test(file + 'No (fatal) error is thrown when connection fails', function (t) {
  process.env.REDISCLOUD_URL = 'redis://rediscloud:@127.0.0.1:6380'; // bad port
  var redisClient = require('../index.js')(); 
  
  t.true(redisClient.connected === false, 
    '✓ redisClient.connected: ' + redisClient.connected);

  redisClient.end(true); // close the (failed) connection
  delete process.env.REDISCLOUD_URL
  t.end(decache('../index.js'));
});

test(file + 'functional test of report_error()', function (t) {
  var redisClient = require('../index.js'); 
  var error = { 
    Error: "Redis connection to 127.0.0.1:6380 failed",
    code: 'ECONNREFUSED',
    errno: 'ECONNREFUSED',
    syscall: 'connect',
    address: '127.0.0.1',
    port: 6380 
  }
  t.true(error === redisClient.report_error(error), 
    '✓ Error reported: ' + error.code);
  
  var error2 = { syscall: false }; // don't report for non-connection errors
  t.true(error2 === redisClient.report_error(error2), 
    '✓ Error reported: none');
  t.end(decache('../index.js'));
});
