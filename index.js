var redis = require('redis');
var url   = require('url');

var rc; // redis config
if (process.env.REDISCLOUD_URL) {
  var redisURL = url.parse(process.env.REDISCLOUD_URL);
  rc = {
    port: redisURL.port,
    host: redisURL.hostname,
    auth: redisURL.auth.split(":")[1]
  }
}
else {
  rc =  {
    port: 6379,
    host: '127.0.0.1'
    // auth: '' no auth on localhost see: https://git.io/vH3TN
  }
}

var CON = {}; // store redis connections as Object

function new_connection () {
    var redis_con = redis.createClient(rc.port, rc.host);
    if (process.env.REDISCLOUD_URL && rc.auth) { // only auth on CI/Stage/Prod 
      redis_con.auth(rc.auth);        // see: https://git.io/vH3TN
    }
    return redis_con;
}

function redis_connection (type) {
  type = type || 'DEFAULT'; // allow infinite types of connections

  if (!CON[type] || !CON[type].connected) {
    CON[type] = new_connection();
  }
  return CON[type];
}

module.exports = redis_connection;

module.exports.kill = function(type) {
  type = type || 'DEFAULT'; // kill specific connection or default one
  CON[type].end(true);
  delete CON[type];
}

module.exports.killall = function() {
  var keys = Object.keys(CON);
  keys.forEach(function(k){
    CON[k].end(true);
    delete CON[k];
  })
}

/**
 * In the event of a failed connection we don't want our Node.js App to "Die"!
 * rather we want to report that the connection failed but then keep running...
 * see: github.com/dwyl/redis-connection/issues/38
 * @param {Object} err - the error Object thrown by Redis (standard node error)
 * @returns {Object} err - unmodified error
 */
var reported; // bit 
function report_error (err) {
  if (!reported && err.syscall === 'connect' && err.code === 'ECONNREFUSED') {
    reported = true; // only report the error once.
    console.log('- - - - - - - - Redis Connection Error: - - - - - - - - ')
    console.error(err);
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - ')  
  }
  return err;
}

process.on('uncaughtException', report_error);

module.exports.report_error = report_error;
