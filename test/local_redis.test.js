var test    = require('tape');
var decache = require('decache');          // http://goo.gl/JIjK9Y

var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + " -> ";

var REDISCLOUD_URL = process.env.REDISCLOUD_URL; // keep a copy for later
delete process.env.REDISCLOUD_URL; // ensures we connect to LOCAL redis
decache('../redis_connection')
require('../redis_connection')();

test(file +" Connect to LOCAL Redis instance and GET/SET", function(t) {
  t.equal(process.env.redisClient.address, '127.0.0.1:6379', "✓ Redis Client connected to: " + redisClient.address)
  process.env.redisClient.set('redis', 'LOCAL', redisClient.print);
  process.env.redisClient.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    process.env.redisClient.end();   // ensure redis con closed! - \\
    t.equal(redisClient.connected, false,  "✓ Connection to LOCAL Closed");
    process.env.REDISCLOUD_URL = REDISCLOUD_URL; // restore rediscloud url
    t.end();
  });
});
