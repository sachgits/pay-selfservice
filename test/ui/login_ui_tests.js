const path = require('path')
const renderTemplate = require(path.join(__dirname, '/../test_helpers/html_assertions.js')).render
const paths = require('../../app/paths.js')

describe('Login view', function () {
  describe('if using SMS', () => {
    it('should render the right messaging when there are errors with user information', function () {
      const templateDate = {
        flash: {
          error: {
            messages: {
              username: 'You must enter a username',
              password: 'You must enter a password'
            }
          }
        }
      }

      const body = renderTemplate('login/login', templateDate)
      body.should.containSelector('.error-summary-heading')
      body.should.containSelector('label[for="username"] .error-message').withText(templateDate.flash.error.messages.username)
      body.should.containSelector('label[for="password"] .error-message').withText(templateDate.flash.error.messages.password)
    })

    it('should render send otp code form', function (done) {
      const templateData = {
        authenticatorMethod: 'SMS'
      }

      const body = renderTemplate('login/otp-login', templateData)

      body.should.containSelector('h1').withExactText('Check your phone')

      body.should.containSelector('form#otp-login-form').withAttribute('action', paths.user.otpLogIn)
      body.should.containSelector('input#sms_code').withAttribute('value', '')

      body.should.containSelector('div#display-otp-login > p:nth-child(3) > a').withExactText('Not received a text message?')
      body.should.containSelector('div#display-otp-login > p:nth-child(3) > a').withAttribute('href', paths.user.otpSendAgain)

      body.should.containSelector('div#display-otp-login > p:nth-child(4) > a').withExactText('Cancel')
      body.should.containSelector('div#display-otp-login > p:nth-child(4) > a').withAttribute('href', paths.user.logOut)

      done()
    })

    it('should render send otp code form with error message', function (done) {
      const templateData = {
        authenticatorMethod: 'SMS',
        flash: {
          error: 'Invalid security code'
        }
      }

      const body = renderTemplate('login/otp-login', templateData)

      body.should.containSelector('h1').withExactText('Check your phone')

      body.should.containSelector('.error-message').withExactText('Invalid security code')

      body.should.containSelector('form#otp-login-form').withAttribute('action', paths.user.otpLogIn)
      body.should.containSelector('input#sms_code').withAttribute('value', '')

      body.should.containSelector('div#display-otp-login > p:nth-child(3) > a').withExactText('Not received a text message?')
      body.should.containSelector('div#display-otp-login > p:nth-child(3) > a').withAttribute('href', paths.user.otpSendAgain)

      body.should.containSelector('div#display-otp-login > p:nth-child(4) > a').withExactText('Cancel')
      body.should.containSelector('div#display-otp-login > p:nth-child(4) > a').withAttribute('href', paths.user.logOut)

      done()
    })
  })
  describe('if using an authenticatior APP', () => {
    it('should render the right messaging when there are errors with user information', function () {
      const templateDate = {
        flash: {
          error: {
            messages: {
              username: 'You must enter a username',
              password: 'You must enter a password'
            }
          }
        }
      }

      const body = renderTemplate('login/login', templateDate)
      body.should.containSelector('.error-summary-heading')
      body.should.containSelector('label[for="username"] .error-message').withText(templateDate.flash.error.messages.username)
      body.should.containSelector('label[for="password"] .error-message').withText(templateDate.flash.error.messages.password)
    })

    it('should render send otp code form', function (done) {
      const templateData = {
        authenticatorMethod: 'APP'
      }

      const body = renderTemplate('login/otp-login', templateData)

      body.should.containSelector('h1').withExactText('Use your authenticator app')

      body.should.containSelector('form#otp-login-form').withAttribute('action', paths.user.otpLogIn)
      body.should.containSelector('input#sms_code').withAttribute('value', '')

      body.should.containSelector('div#display-otp-login > p:nth-child(3) > a').withExactText('Cancel')
      body.should.containSelector('div#display-otp-login > p:nth-child(3) > a').withAttribute('href', paths.user.logOut)

      done()
    })

    it('should render send otp code form with error message', function (done) {
      const templateData = {
        authenticatorMethod: 'APP',
        flash: {
          error: 'Invalid security code'
        }
      }

      const body = renderTemplate('login/otp-login', templateData)

      body.should.containSelector('h1').withExactText('Use your authenticator app')

      body.should.containSelector('.error-message').withExactText('Invalid security code')

      body.should.containSelector('form#otp-login-form').withAttribute('action', paths.user.otpLogIn)
      body.should.containSelector('input#sms_code').withAttribute('value', '')

      body.should.containSelector('div#display-otp-login > p:nth-child(3) > a').withExactText('Cancel')
      body.should.containSelector('div#display-otp-login > p:nth-child(3) > a').withAttribute('href', paths.user.logOut)

      done()
    })
  })
})
