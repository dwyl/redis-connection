require('env2')('config.env');
var REDIS_URL = process.env.REDIS_URL;
delete process.env.REDIS_URL; // delete to ensure we use LOCAL Redis!

var test    = require('tape');
var decache = require('decache');          // http://goo.gl/JIjK9Y

var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + " -> ";

var redisClient = require('../index.js')();
test(file +" Connect to LOCAL Redis instance and GET/SET", function(t) {
  t.equal(redisClient.address, '127.0.0.1:6379',
  "✓ Redis Client connected to: " + redisClient.address)
  redisClient.set('redis', 'LOCAL');
  redisClient.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    t.end();
  });
});

var redisSub = require('../index.js')('subscriber');
test(file +" Connect to LOCAL Redis instance and GET/SET", function(t) {
  t.equal(redisSub.address, '127.0.0.1:6379',
  "✓ Redis Client connected to: " + redisSub.address)
  redisSub.set('redis', 'LOCAL');
  redisSub.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    t.end();
  });
});

test('Require an existing Redis connection', function(t){
  var r2 = require('../index.js')();
  r2.get('redis', function(err, reply){
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    t.end();
  });
});

test('Require an existing Redis SUBSCRIBER connectiong', function(t){
  var rs2 = require('../index.js')('subscriber');
  rs2.get('redis', function(err, reply){
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    t.end();
  });
});

test('Restore REDIS_URL for Heroku Compatibility tests', function(t){
  redisClient.end();   // ensure redis con closed!
  redisSub.end();
  decache('../index.js');
  t.equal(redisClient.connected, false,  "✓ Connection to LOCAL Closed");
  process.env.REDIS_URL = REDIS_URL; // restore for next text!
  t.end();
});
