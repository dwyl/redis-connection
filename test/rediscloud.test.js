var test    = require('tape');

var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + " -> ";

test(file + " Confirm RedisCloud is accessible GET/SET", function(t) {
  var redisClient = require('../index.js')();
  redisClient.set('redis', 'working', redisClient.print);
  // console.log("✓ Redis Client connected to: " + redisClient.address);
  t.ok(redisClient.address !== '127.0.0.1:6379', "✓ Redis Client connected to: " + redisClient.address)
  redisClient.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'working', '✓ RedisCLOUD is ' + reply.toString());
    redisClient.end();   // ensure redis con closed! - \\
    t.equal(redisClient.connected, false, "✓ Connection to RedisCloud Closed");
    t.end();
  });
});
