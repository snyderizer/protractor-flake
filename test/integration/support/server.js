/* eslint-disable no-console */

// we keep this es5 for easier interop with bin files
var express = require('express')
var app = express()
var fs = require('fs')

var FLAKE_FILE = __dirname + '/times-flaked'
var server = null

app.use(function logMiddleware (req, res, next) {
  req.logger = function () {
    if (app.get('log')) {
      console.log.apply(console, arguments)
    }
  }

  next()
})

app.get('/', function (req, res) {
  res.send('<html><body><div id="home">Hello.</div></html></body>')
})

app.get('/flake/:timesToFlake', function (req, res, next) {
  var timesToFlake = req.params.timesToFlake

  fs.readFile(FLAKE_FILE, function (err, buffer) {
    var timesFlaked

    if (err && err.code === 'ENOENT') {
      timesFlaked = 1
    } else {
      timesFlaked = parseInt(buffer.toString(), 10)
    }

    req.logger('Flaked', timesFlaked, '/', timesToFlake)

    if (timesFlaked >= timesToFlake) {
      res.send('<div id="success">Success!</div>')
    } else {
      fs.writeFile(FLAKE_FILE, timesFlaked + 1, {flag: 'w'}, function (err) {
        if (err) {
          return next(err)
        }
        res.status(400)
        res.send('<div id="failure">Failure!</div>')
      })
    }
  })
})

module.exports = {
  listen: function (options, callback) {
    options = options || {}
    var port = options.port || '6060'


    app.use(require('morgan')('combined'))
    app.set('log', true)

    server = app.listen('4040', function (err, x) {
      if (err || x) {
        console.log(`ERR ${err} X: ${x}`)
      }
      console.log('Test server listening at ', port)
      if (callback) { callback() }
    })

    server.on('error', function (e) {
      console.log('express error', e)
    })
  },
  close: function () {
    server.close()
  }
}
