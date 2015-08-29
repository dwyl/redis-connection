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

Given that we modularise our apps and we
don't want each *file* opening multiple connections to the Redis datastore
(*because* ***Redis connections*** *are a* ***scarce resource*** - [RedisCloud](https://addons.heroku.com/rediscloud) is *30 connections* - *and
  each connection needs to be closed for tape tests to exit*...)

We decided it made sense to use a global connection.
