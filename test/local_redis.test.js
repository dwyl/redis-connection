var test    = require('tape');
var decache = require('decache');          // http://goo.gl/JIjK9Y

var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + " -> ";

var REDISCLOUD_URL = process.env.REDISCLOUD_URL; // keep a copy for later
delete process.env.REDISCLOUD_URL; // ensures we connect to LOCAL redis
// decache('../redis_connection')
var redisClient = require('../redis_connection')();
// console.log(process.env);
test(file +" Connect to LOCAL Redis instance and GET/SET", function(t) {
  t.equal(redisClient.address, '127.0.0.1:6379',
  "✓ Redis Client connected to: " + redisClient.address)
  redisClient.set('redis', 'LOCAL');
  redisClient.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    redisClient.end();   // ensure redis con closed! - \\
    t.equal(redisClient.connected, false,  "✓ Connection to LOCAL Closed");
    REDISCLOUD_URL = REDISCLOUD_URL; // restore rediscloud url
    t.end();
  });
});
