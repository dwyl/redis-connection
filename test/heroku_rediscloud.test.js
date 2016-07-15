var test    = require('tape');
var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + " -> ";

test(file + " Confirm RedisCloud is accessible GET/SET", function(t) {
  require('env2')('.env');
  console.log(' - - - - - - - - - - - - - process.env:');
  // console.log(process.env);
  var redisClient = require('../index.js')();
  t.ok(redisClient.address !== '127.0.0.1:6379',
    "✓ Redis Client connected to: " + redisClient.address);

  redisClient.set('redis', 'working', function(err, res) {
    console.log("✓ Redis Client connected to: " + redisClient.address);
    redisClient.get('redis', function (err, reply) {
      t.equal(reply.toString(), 'working', '✓ RedisCLOUD is ' + reply.toString());
      redisClient.end();   // ensure redis con closed! - \\
      t.equal(redisClient.connected, false, "✓ Connection to RedisCloud Closed");
      delete process.env.REDISCLOUD_URL;
      require('decache')('../index.js');
      t.end();
    });
  });
});
