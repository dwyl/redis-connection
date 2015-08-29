# Redis Connection

A ***Global Redis Connection*** that can be used anywhere in your app
and closed ***once*** at the end of tests.

[![Build Status](https://travis-ci.org/nelsonic/redis-connection.svg)](https://travis-ci.org/nelsonic/redis-connection)
[![HitCount](https://hitt.herokuapp.com/nelsonic/redis-connection.svg)](https://github.com/nelsonic/redis-connection)
[![Code Climate](https://codeclimate.com/github/nelsonic/redis-connection/badges/gpa.svg)](https://codeclimate.com/github/nelsonic/redis-connection)
[![codecov.io](http://codecov.io/github/nelsonic/redis-connection/coverage.svg?branch=master)](http://codecov.io/github/nelsonic/redis-connection?branch=master)
[![Dependency Status](https://david-dm.org/nelsonic/redis-connection.svg)](https://david-dm.org/nelsonic/redis-connection)
[![devDependency Status](https://david-dm.org/nelsonic/redis-connection/dev-status.svg)](https://david-dm.org/nelsonic/redis-connection#info=devDependencies)


## Why?

At ***dwyl*** *we* ***use Redis everywhere*** *because its* ***fast***!

> If you're *new* to Redis, checkout our *beginners tutorial*:
https://github.com/dwyl/learn-redis

Given that Redis can handle ***millions of operations per second***,
it is *unlikely* to be the *bottleneck* in your application/stack.

Where you *can* (*unintentionally*) *create* an issue is by having
*too many* connections to your Redis Datastore.
*Don't laugh*, we've seen this happen,
where people open a *new connection* to Redis for *each* incoming http
request (*and forget to close them!*) and thus quickly run out
of available connections to Redis!

Most apps *really* only need ***one*** connection to Redis (*per node.js instance*)
Or, if you are using Redis' **Publish/Subscribe** feature, you will need ***two*** connections per node.js server; one for a "*standard*" connection (*the* "***Publisher***"") and another as a "***Subscriber***"


Given that we *modularise* our apps and we
don't want each *file* opening multiple connections to the Redis datastore
(*because* ***Redis connections*** *are a* ***scarce resource*** - [RedisCloud](https://addons.heroku.com/rediscloud) is *30 connections* - *and
  each connection needs to be closed for tape tests to exit*...)
we decided write a *little* script to instantiate a *single* connection
to Redis which can be re-used across multiple files.


## What?

An ***easy*** way to re-use your ***single*** Redis connection
(*or* ***pair*** of connections - when using Redis Publish/Subscribe)
across multiple files in your application.


## *How*?

### Install from NPM

```sh
npm install redis-connection --save
```

### Use in your

```js
var redisClient = require('redis-connection')();
redisClient.set('hello', 'world');
redisClient.get('hello', function (err, reply) {
  console.log('hello', reply.toString()); // hello world
});
```

### Create a Subscriber Connection

```js
var redisSub = require('redis-connection')('subscriber');
redisSub.subscribe("chat:messages:latest", "chat:people:new");
// see: https://github.com/dwyl/hapi-socketio-redis-chat-example ;-)
```

### Using `redis-connection` with `env2`

If you are using [**env2**](https://github.com/dwyl/env2) to load your configuration file, simply require `env2` before requiring `redis-connection`:

```js
require('env2')('config.env');
var redisClient = require('redis-connection')();
// now use your redis connection
```

## Need More?

If you need us to support a different Redis-as-a-service provider
or want to have more configuration options, please let us know!
[![Join the chat at https://gitter.im/dwyl/chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dwyl/chat/?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
