var test    = require('tape');

var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + " -> ";

test(file + " Confirm remote Redis is accessible GET/SET", function(t) {
  // require('env2')('config.env');
  console.log(process.env.REDIS_URL);
  var redisClient = require('../index.js')();
  redisClient.set('redis', 'working');
  // console.log("✓ Redis Client connected to: " + redisClient.address);
  t.ok(redisClient.address !== '127.0.0.1:6379', "✓ Redis Client connected to: " + redisClient.address)
  redisClient.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'working', '✓ remote Redis is ' + reply.toString());
    redisClient.end();   // ensure redis con closed! - \\
    t.equal(redisClient.connected, false, "✓ Connection to remote Redis Closed");
    t.end();
  });
});
