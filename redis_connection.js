var redis = require('redis');

function redis_connection (type) {
  var rc; // redis config
  if (process.env.REDISCLOUD_URL) {
    var redisURL = url.parse(process.env.REDISCLOUD_URL);
    config = {
      port: redisURL.port,
      host: redisURL.hostname,
      auth: redisURL.auth.split(":")[1]
    }
  }
  else {
    rc =  {
      port: 6379,
      host: '127.0.0.1',
      auth: null
    }
  }
  if(process.env.redisClient && process.env.redisClient.connected) {
    return;
  } else {
    // create client and authenticate
    process.env.redisClient = redis.createClient(rc.port, rc.host);
    process.env.redisClient.auth(rc.auth);
  }
  if(type === 'pubsub' && !process.env.redisSub){
    // create a subscriber connection:
    process.env.redisSub = redis.createClient(rc.port, rc.host);
    process.env.redisSub.auth(rc.auth);
  }


}

// redis_connection(); // auto run!

module.exports = redis_connection;
