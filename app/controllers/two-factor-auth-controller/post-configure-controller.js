'use strict'

// NPM dependencies
const logger = require('winston')
const lodash = require('lodash')

// Local dependencies
const paths = require('../../paths')
const userService = require('../../services/user_service.js')

module.exports = (req, res) => {
  const code = req.body['code'] || ''
  const method = lodash.get(req, 'session.pageData.twoFactorAuthMethod', 'APP')
  userService.configureNewOtpKey(req.user.externalId, code, method, req.correlationId)
    .then(user => {
      if (method === 'APP') {
        req.flash('generic', `<h2>Your sign-in method has been&nbsp;updated</h2><p>Use your authenticator app when you next sign in</p>`)
      } else {
        req.flash('generic', `<h2>Your sign-in method has been&nbsp;updated</h2><p>We’ll send you a text message when you next sign in</p>`)
      }
      return res.redirect(paths.user.profile)
    })
    .catch((err) => {
      let errorMessageLog, errorMessageUser
      if (err.errorCode === 401) {
        errorMessageLog = `Activating new OTP key failed, bad code`
        errorMessageUser = `<h2>There was a problem with the details you gave for:</h2><ul class="error-summary-list"><li><a href="#code">Please enter a valid security code</a></li></ul>`
      } else {
        errorMessageLog = `Activating new OTP key failed, server error`
        errorMessageUser = `<h2>Internal server error, please try again</h2>`
      }
      logger.error(`[requestId=${req.correlationId}] ${errorMessageLog}`)
      req.flash('genericError', errorMessageUser)
      return res.redirect(paths.user.twoFactorAuth.configure)
    })
}
