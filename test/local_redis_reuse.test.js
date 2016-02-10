var test    = require('tape');
var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + " -> ";
var decache = require('decache'); // http://goo.gl/JIjK9Y
decache('../index.js');

test(file +" Connect to LOCAL Redis instance CLOSED in Previous Test", function(t) {
  var redisClient = require('../index.js')(); // connect
  t.equal(redisClient.address, '127.0.0.1:6379',
  "✓ Redis Client connected to: " + redisClient.address)
  redisClient.set('redis', 'LOCAL', function(err,reply){
    redisClient.get('redis', function (err, reply) {
      t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
      redisClient.end();   // ensure redis con closed! - \\
      t.equal(redisClient.connected, false, "✓ Connection to Redis Closed");
      t.end();
    });
  });
});

test(file +" Connect to LOCAL Redis instance Which was CLOSED in Previous Test", function(t) {
  delete process.env.REDISCLOUD_URL; // delete to ensure we use LOCAL Redis!
  var redisClient = require('../index.js')(); // re-connect
  t.equal(redisClient.address, '127.0.0.1:6379',
  "✓ Redis Client RE-connected to: " + redisClient.address)
  redisClient.set('redis', 'RE-CONNECTED', function(err, reply){
    redisClient.get('redis', function (err, reply) {
      t.equal(reply.toString(), 'RE-CONNECTED', '✓ LOCAL Redis is ' +reply.toString());
      redisClient.end();   // ensure redis con closed! - \\
      decache('../index.js');
      t.end();
    });
  });
});
