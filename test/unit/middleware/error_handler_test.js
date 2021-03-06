'use strict'

// Node.js core dependencies
const path = require('path')
const assert = require('assert')

// NPM dependencies
const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('error_handler middleware', function () {
  let winstonErrorSpy
  let errorHandler

  beforeEach(() => {
    winstonErrorSpy = sinon.spy()
    errorHandler = proxyquire(path.join(__dirname, '/../../../app/middleware/error_handler'), {
      'winston': {
        error: winstonErrorSpy
      }
    })
  })

  it('should log string error', function (done) {
    const err = 'Error text'
    const req = {
      originalUrl: 'originalUrl',
      url: 'url',
      correlationId: 'correlationId'
    }
    const res = {}
    const next = sinon.spy()

    errorHandler(err, req, res, next)

    const errorPayload = {
      request: {
        originalUrl: req.originalUrl,
        url: req.url
      },
      error: {
        message: err
      }
    }
    assert(winstonErrorSpy.calledWith(`[requestId=${req.correlationId}] Internal server error -`, errorPayload))
    assert(next.calledWith(err))

    done()
  })

  it('should log object error', function (done) {
    const err = {
      message: 'error message',
      stack: 'error stack'
    }
    const req = {
      originalUrl: 'originalUrl',
      url: 'url',
      correlationId: 'correlationId'
    }
    const res = {}
    const next = sinon.spy()

    errorHandler(err, req, res, next)

    const errorPayload = {
      request: {
        originalUrl: req.originalUrl,
        url: req.url
      },
      error: {
        message: err.message,
        stack: err.stack
      }
    }
    assert(winstonErrorSpy.calledWith(`[requestId=${req.correlationId}] Internal server error -`, errorPayload))
    assert(next.calledWith(err))

    done()
  })
})
