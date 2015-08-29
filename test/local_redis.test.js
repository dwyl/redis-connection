var test    = require('tape');
var decache = require('decache');          // http://goo.gl/JIjK9Y

var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + " -> ";

var REDISCLOUD_URL = process.env.REDISCLOUD_URL; // keep a copy for later
delete process.env.REDISCLOUD_URL; // ensures we connect to LOCAL redis

var redisClient = require('../redis_connection')();
test(file +" Connect to LOCAL Redis instance and GET/SET", function(t) {
  t.equal(redisClient.address, '127.0.0.1:6379',
  "✓ Redis Client connected to: " + redisClient.address)
  redisClient.set('redis', 'LOCAL');
  redisClient.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    REDISCLOUD_URL = REDISCLOUD_URL; // restore rediscloud url
    t.end();
  });
});

var redisSub = require('../redis_connection')('subscriber');
test(file +" Connect to LOCAL Redis instance and GET/SET", function(t) {
  t.equal(redisClient.address, '127.0.0.1:6379',
  "✓ Redis Client connected to: " + redisClient.address)
  redisClient.set('redis', 'LOCAL');
  redisClient.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    REDISCLOUD_URL = REDISCLOUD_URL; // restore rediscloud url
    t.end();
  });
});


test('Restore REDISCLOUD_URL for Heroku Compatibility tests', function(t){
  process.env.REDISCLOUD_URL = REDISCLOUD_URL; // restore rediscloud url
  t.ok(process.env.REDISCLOUD_URL, "All Set!")
  redisClient.end();   // ensure redis con closed!
  redisSub.end();
  t.equal(redisClient.connected, false,  "✓ Connection to LOCAL Closed");
  t.end();
});
