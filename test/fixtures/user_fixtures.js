'use strict'

// NPM dependencies
const _ = require('lodash')

// Custom dependencies
let User = require('../../app/models/User.class')
let pactBase = require('./pact_base')
let pactUsers = pactBase({array: ['permissions', 'gateway_account_ids', 'service_ids', 'service_roles', 'services', '_links']})

function validPassword () {
  return 'G0VUkPay2017Rocks'
}

function merchantDetailsFixture () {
  return {
    name: 'name',
    address_line1: 'line1',
    address_line2: 'line2',
    address_city: 'City',
    address_postcode: 'POSTCODE',
    address_country: 'GB'
  }
}

module.exports = {

  validMinimalUser: () => {
    let newExternalId = '8e1a29e4f66e409693d6e530bff7a642'
    let newUsername = '5nxja'
    let defaultServiceId = '535'
    let accountIds = ['507']

    let data = {
      external_id: newExternalId,
      username: newUsername,
      email: `${newUsername}@example.com`,
      service_roles: [{
        service: {
          name: 'System Generated',
          external_id: defaultServiceId,
          gateway_account_ids: accountIds
        },
        role: {
          name: 'admin',
          description: 'Administrator',
          permissions: ['perm-1']
        }
      }],
      telephone_number: '07700 95665',
      secondFactor: 'SMS'
    }

    return {
      getPactified: () => {
        return pactUsers.pactify(data)
      },
      getAsObject: () => {
        return new User(data)
      },
      getPlain: () => {
        return data
      }
    }
  },
  validUserWithMerchantDetails: (opts = {}) => {
    let newExternalId = '79d686ec43bc4768b2600d2e1e41e54e'
    let newUsername = '6fu6kr'
    let defaultServiceId = opts.default_service_id || '946'
    let gatewayAccountIds = opts.gateway_account_ids || ['218']
    let merchantDetails = opts.merchant_details || merchantDetailsFixture()

    let data = {
      external_id: opts.external_id || newExternalId,
      username: opts.username || newUsername,
      email: opts.email || `${newUsername}@example.com`,
      service_roles: opts.service_roles || [{
        service: {
          name: 'System Generated',
          external_id: defaultServiceId,
          gateway_account_ids: gatewayAccountIds,
          merchant_details: merchantDetails
        },
        role: opts.role || {
          name: 'admin',
          description: 'Administrator',
          permissions: opts.permissions || [{name: 'perm-1'}]
        }
      }],
      telephone_number: opts.telephone_number || '922037',
      otp_key: opts.otp_key || '56609',
      disabled: opts.disabled || false,
      login_counter: opts.login_counter || 0,
      session_version: opts.session_version || 0
    }
    return {
      getPactified: () => {
        return pactUsers.pactify(data)
      },
      getAsObject: () => {
        return new User(data)
      },
      getPlain: () => {
        return data
      }
    }
  },
  validUser: (opts = {}) => {
    let newExternalId = '121391373c1844dd99cb3416b70785c8'
    let newUsername = 'm87bmh'
    let defaultServiceId = opts.default_service_id || '193'
    let gatewayAccountIds = opts.gateway_account_ids || ['540']

    let data = {
      external_id: opts.external_id || newExternalId,
      username: opts.username || newUsername,
      email: opts.email || `${newUsername}@example.com`,
      service_roles: opts.service_roles || [{
        service: {
          name: 'System Generated',
          external_id: defaultServiceId,
          gateway_account_ids: gatewayAccountIds
        },
        role: opts.role || {
          name: 'admin',
          description: 'Administrator',
          permissions: opts.permissions || [{name: 'perm-1'}]
        }
      }],
      telephone_number: opts.telephone_number || '940583',
      otp_key: opts.otp_key || '2994',
      disabled: opts.disabled || false,
      login_counter: opts.login_counter || 0,
      session_version: opts.session_version || 0,
      features: opts.features || '',
      second_factor: opts.second_factor || 'SMS',
      provisional_otp_key: opts.provisional_otp_key || '60400'
    }

    return {
      getPactified: () => {
        return pactUsers.pactify(data)
      },
      getAsObject: () => {
        return new User(data)
      },
      getPlain: () => {
        return data
      }
    }
  },

  /**
   * @param request Params override response
   * @return {{getPactified: (function()) Pact response, getAsObject: (function()) User, getPlain: (function()) request with overrides applied}}
   */
  validUserResponse: (request = {}) => {
    let existingExternalId = '7d19aff33f8948deb97ed16b2912dcd3'
    let reqExternalId = request.external_id || existingExternalId
    let reqEmail = request.email || `${request.username || 'existing-user'}@example.com`
    let defaultServiceId = 'cp5wa'
    const gatewayAccountIds = request.gateway_account_ids || ['758', '772']

    let data = {
      external_id: reqExternalId,
      username: reqEmail,
      email: reqEmail,
      service_roles: request.service_roles || [{
        service: {
          name: 'System Generated',
          external_id: defaultServiceId,
          gateway_account_ids: gatewayAccountIds
        },
        role: {
          name: 'admin',
          description: 'Administrator',
          permissions: request.permissions || [{name: 'perm-1'}, {name: 'perm-2'}, {name: 'perm-3'}]
        }
      }],
      otp_key: request.otp_key || '43c3c4t',
      telephone_number: request.telephone_number || '0123441',
      '_links': [{
        'href': `http://adminusers.service/v1/api/users/${reqExternalId}`,
        'rel': 'self',
        'method': 'GET'
      }],
      second_factor: request.second_factor || 'SMS',
      provisional_otp_key: request.provisional_otp_key || '55970'
    }

    return {
      getPactified: () => {
        return pactUsers.pactify(data)
      },
      getAsObject: () => {
        return new User(data)
      },
      getPlain: () => {
        return data
      }
    }
  },

  /**
   * @param request Params override response
   * @return {{getPactified: (function()) Pact response, getAsObject: (function()) User, getPlain: (function()) request with overrides applied}}
   */
  validMultipleUserResponse: (opts = []) => {
    if (opts.length === 0) opts.push({})
    const data = []

    opts.forEach(intendedUser => {
      const externalId = intendedUser.external_id || '8d8db4f2ad7d4c0c8373a09d9e95468b'
      const username = intendedUser.username || 'b9g0vm'
      const gatewayAccountIds = intendedUser.gateway_account_ids || ['213', '270']

      data.push({
        external_id: externalId,
        username: username,
        email: intendedUser.email || `${username}@example.com`,
        service_roles: intendedUser.service_roles || [{
          service: {
            name: 'System Generated',
            external_id: '0a9aa1216b93460a963f125b3f12e530',
            gateway_account_ids: gatewayAccountIds
          },
          role: {
            name: 'admin',
            description: 'Administrator',
            permissions: intendedUser.permissions || [{name: 'perm-1'}, {name: 'perm-2'}, {name: 'perm-3'}]
          }
        }],
        otp_key: intendedUser.otp_key || '7200b91bc4ba4eac958d3d7c33f119b1',
        telephone_number: intendedUser.telephone_number || '07700 91044',
        '_links': [{
          'href': `http://adminusers.service/v1/api/users/${externalId}`,
          'rel': 'self',
          'method': 'GET'
        }]
      })
    })

    return {
      getPactified: () => {
        return data.map(pactUsers.pactify)
      },
      getAsObject: () => {
        return data.map(datum => new User(datum))
      },
      getPlain: () => {
        return data
      }
    }
  },

  validAuthenticateRequest: (options) => {
    let request = {
      username: options.username || 'username',
      password: options.password || 'password'
    }

    return pactUsers.withPactified(request)
  },

  unauthorizedUserResponse: () => {
    let response = {
      errors: ['invalid username and/or password']
    }

    return pactUsers.withPactified(response)
  },

  badAuthenticateResponse: () => {
    let response = {
      errors: ['Field [username] is required', 'Field [password] is required']
    }

    return pactUsers.withPactified(response)
  },

  validIncrementSessionVersionRequest: () => {
    let request = {
      op: 'append',
      path: 'sessionVersion',
      value: 1
    }

    return pactUsers.withPactified(request)
  },

  validAuthenticateSecondFactorRequest: (code) => {
    let request = {
      code: code || '123456'
    }

    return pactUsers.withPactified(request)
  },

  validUpdatePasswordRequest: (token, newPassword) => {
    let request = {
      forgotten_password_code: token || '5ylaem',
      new_password: newPassword || validPassword()
    }

    return pactUsers.withPactified(request)
  },

  validUpdateServiceRoleRequest: (role) => {
    let request = {
      role_name: role || 'admin'
    }

    return pactUsers.withPactified(request)
  },

  validAssignServiceRoleRequest: (serviceExternalId, role) => {
    let request = {
      service_external_id: serviceExternalId || '9en17v',
      role_name: role || 'admin'
    }

    return pactUsers.withPactified(request)
  },

  validPasswordAuthenticateRequest: (opts = {}) => {

    const usernameGenerate = opts.username || 'validuser'
    const usernameMatcher = opts.usernameMatcher || 'validuser'

    const passwordGenerate = opts.password || 'validpassword'
    const passwordMatcher = opts.passwordMatcher || 'validpassword'

    return {
      username: pactUsers.pactifyMatch(usernameGenerate, usernameMatcher),
      password: pactUsers.pactifyMatch(passwordGenerate, passwordMatcher)
    }

  },

  invalidPasswordAuthenticateRequest: (opts = {}) => {

    const usernameGenerate = opts.username || 'validuser'
    const usernameMatcher = opts.usernameMatcher || 'validuser'

    const passwordGenerate = opts.password || 'invalidpassword'
    const passwordMatcher = opts.passwordMatcher || 'invalidpassword'

    return {
      username: pactUsers.pactifyMatch(usernameGenerate, usernameMatcher),
      password: pactUsers.pactifyMatch(passwordGenerate, passwordMatcher)
    }

  },

  validPasswordAuthenticateResponse: (opts = {}) => {
    let response =
      {
        external_id: opts.external_id || '09283568e105442da3928d1fa99fb0eb',
        username: opts.username || 'nbGscObDSKxf31CjF0uzGRwnOaNyztKw@example.com',
        email: opts.email || 'nbGscObDSKxf31CjF0uzGRwnOaNyztKw@example.com',
        gateway_account_ids: opts.gateway_account_ids || [],
        otp_key: opts.otp_key || 'nlcj80ivce10tkjdbnaicf6brk',
        telephone_number: opts.telephone_number || '9797219',
        service_roles: opts.service_roles || [
          {
            service: {
              id: 857,
              external_id: '0ab3525259894209bbc8d2a5b0538fc0',
              name: 'System Generated',
              gateway_account_ids: [
                '923'
              ],
              _links: []
            },
            role: {
              name: 'admin',
              description: 'Administrator',
              permissions: [
                {
                  name: 'users-service:read',
                  description: 'Viewusersinservice'
                },
                {
                  name: 'users-service:create',
                  description: 'Createuserinthisservice'
                },
                {
                  name: 'tokens-active:read',
                  description: 'Viewactivekeys'
                },
                {
                  name: 'tokens-revoked:read',
                  description: 'Viewrevokedkeys'
                },
                {
                  name: 'tokens:create',
                  description: 'Generatekey'
                },
                {
                  name: 'tokens:update',
                  description: 'Generatekey'
                },
                {
                  name: 'tokens:delete',
                  description: 'Revokekey'
                },
                {
                  name: 'transactions:read',
                  description: 'Viewtransactionslist'
                },
                {
                  name: 'transactions-by-date:read',
                  description: 'Searchtransactionsbydate'
                },
                {
                  name: 'transactions-by-fields:read',
                  description: 'Searchtransactionsbypaymentfields'
                },
                {
                  name: 'transactions-download:read',
                  description: 'Downloadtransactions'
                },
                {
                  name: 'transactions-details:read',
                  description: 'Viewtransactiondetails'
                },
                {
                  name: 'transactions-events:read',
                  description: 'Viewtransactionevents'
                },
                {
                  name: 'refunds:create',
                  description: 'Issuerefund'
                },
                {
                  name: 'transactions-amount:read',
                  description: 'Viewtransactionamounts'
                },
                {
                  name: 'transactions-description:read',
                  description: 'Viewtransactiondescription'
                },
                {
                  name: 'transactions-email:read',
                  description: 'Viewtransactionemail'
                },
                {
                  name: 'transactions-card-type:read',
                  description: 'Viewtransactioncardtype'
                },
                {
                  name: 'gateway-credentials:read',
                  description: 'Viewgatewayaccountcredentials'
                },
                {
                  name: 'gateway-credentials:update',
                  description: 'Editgatewayaccountcredentials'
                },
                {
                  name: 'service-name:read',
                  description: 'Viewservicename'
                },
                {
                  name: 'service-name:update',
                  description: 'Editservicename'
                },
                {
                  name: 'payment-types:read',
                  description: 'Viewpaymenttypes'
                },
                {
                  name: 'payment-types:update',
                  description: 'Editpaymenttypes'
                },
                {
                  name: 'email-notification-template:read',
                  description: 'Viewemailnotificationstemplate'
                },
                {
                  name: 'email-notification-paragraph:update',
                  description: 'Editemailnotificationsparagraph'
                },
                {
                  name: 'email-notification-toggle:update',
                  description: 'Turnemailnotificationson/off'
                },
                {
                  name: 'tokens:read',
                  description: 'View keys'
                },
                {
                  name: 'toggle-3ds:read',
                  description: 'View 3D Secure setting'
                },
                {
                  name: 'toggle-3ds:update',
                  description: 'Edit 3D Secure setting'
                },
                {
                  name: 'users-service:delete',
                  description: 'Remove user from a service'
                },
                {
                  name: 'merchant-details:read',
                  description: 'View Merchant Details setting'
                },
                {
                  name: 'merchant-details:update',
                  description: 'Edit Merchant Details setting'
                }
              ]
            }
          }
        ],
        features: opts.features || null,
        second_factor: opts.second_factor || 'SMS',
        provisional_otp_key: opts.provisional_otp_key || null,
        provisional_otp_key_created_at: opts.provisional_otp_key_created_at || null,
        services: opts.services || [{
          id: 857,
          external_id: '0ab3525259894209bbc8d2a5b0538fc0',
          name: 'System Generated',
          gateway_account_ids: [
            '923'
          ],
          _links: []
        }],
        disabled: opts.disabled || false,
        login_counter: opts.login_counter || 0,
        session_version: opts.session_version || 0,
        service_ids: opts.service_ids || ['857'],
        _links: opts._links || [{
          rel: 'self',
          method: 'GET',
          href: 'http://localhost:8080/v1/api/users/09283568e105442da3928d1fa99fb0eb'
        }],
        role: opts.role || {
          name: 'admin',
          description:
            'Administrator',
          permissions:
            [
              {
                name: 'users-service:read',
                description: 'Viewusersinservice'
              },
              {
                name: 'users-service:create',
                description: 'Createuserinthisservice'
              },
              {
                name: 'tokens-active:read',
                description: 'Viewactivekeys'
              },
              {
                name: 'tokens-revoked:read',
                description: 'Viewrevokedkeys'
              },
              {
                name: 'tokens:create',
                description: 'Generatekey'
              },
              {
                name: 'tokens:update',
                description: 'Generatekey'
              },
              {
                name: 'tokens:delete',
                description: 'Revokekey'
              },
              {
                name: 'transactions:read',
                description: 'Viewtransactionslist'
              },
              {
                name: 'transactions-by-date:read',
                description: 'Searchtransactionsbydate'
              },
              {
                name: 'transactions-by-fields:read',
                description: 'Searchtransactionsbypaymentfields'
              },
              {
                name: 'transactions-download:read',
                description: 'Downloadtransactions'
              },
              {
                name: 'transactions-details:read',
                description: 'Viewtransactiondetails'
              },
              {
                name: 'transactions-events:read',
                description: 'Viewtransactionevents'
              },
              {
                name: 'refunds:create',
                description: 'Issuerefund'
              },
              {
                name: 'transactions-amount:read',
                description: 'Viewtransactionamounts'
              },
              {
                name: 'transactions-description:read',
                description: 'Viewtransactiondescription'
              },
              {
                name: 'transactions-email:read',
                description: 'Viewtransactionemail'
              },
              {
                name: 'transactions-card-type:read',
                description: 'Viewtransactioncardtype'
              },
              {
                name: 'gateway-credentials:read',
                description: 'Viewgatewayaccountcredentials'
              },
              {
                name: 'gateway-credentials:update',
                description: 'Editgatewayaccountcredentials'
              },
              {
                name: 'service-name:read',
                description: 'Viewservicename'
              },
              {
                name: 'service-name:update',
                description: 'Editservicename'
              },
              {
                name: 'payment-types:read',
                description: 'Viewpaymenttypes'
              },
              {
                name: 'payment-types:update',
                description: 'Editpaymenttypes'
              },
              {
                name: 'email-notification-template:read',
                description: 'Viewemailnotificationstemplate'
              },
              {
                name: 'email-notification-paragraph:update',
                description: 'Editemailnotificationsparagraph'
              },
              {
                name: 'email-notification-toggle:update',
                description: 'Turnemailnotificationson/off'
              },
              {
                name: 'tokens:read',
                description: 'View keys'
              },
              {
                name: 'toggle-3ds:read',
                description: 'View 3D Secure setting'
              },
              {
                name: 'toggle-3ds:update',
                description: 'Edit 3D Secure setting'
              },
              {
                name: 'users-service:delete',
                description: 'Remove user from a service'
              },
              {
                name: 'merchant-details:read',
                description: 'View Merchant Details setting'
              },
              {
                name: 'merchant-details:update',
                description: 'Edit Merchant Details setting'
              }
            ]
        }
        ,
        permissions: opts.permissions || [
          'users-service:read',
          'users-service:create',
          'tokens-active:read',
          'tokens-revoked:read',
          'tokens:create',
          'tokens:update',
          'tokens:delete',
          'transactions:read',
          'transactions-by-date:read',
          'transactions-by-fields:read',
          'transactions-download:read',
          'transactions-details:read',
          'transactions-events:read',
          'refunds:create',
          'transactions-amount:read',
          'transactions-description:read',
          'transactions-email:read',
          'transactions-card-type:read',
          'gateway-credentials:read',
          'gateway-credentials:update',
          'service-name:read',
          'service-name:update',
          'payment-types:read',
          'payment-types:update',
          'email-notification-template:read',
          'email-notification-paragraph:update',
          'email-notification-toggle:update',
          'tokens:read',
          'toggle-3ds:read',
          'toggle-3ds:update',
          'users-service:delete',
          'merchant-details:read',
          'merchant-details:update'
        ]
      }
    return pactUsers.withPactified(response)
  },

  invalidPasswordAuthenticateResponse: () => {
    let response = {
      errors: ['invalid username and/or password']
    }

    return pactUsers.withPactified(response)
  },

  validForgottenPasswordCreateRequest: (username) => {
    let request = {
      username: username || 'username@email.com'
    }

    return pactUsers.withPactified(request)
  },

  validForgottenPasswordResponse: (payload) => {
    let request = payload || {}
    let code = 'h41ne'
    let response = {
      user_external_id: request.userExternalId || 'userExternalId',
      code: request.code || code,
      date: '2010-12-31T22:59:59.132Z',
      '_links': [{
        'href': `http://localhost:8080/v1/api/forgotten-passwords/${code}`,
        'rel': 'self',
        'method': 'GET'
      }]
    }

    return pactUsers.withPactified(response)
  },

  badForgottenPasswordResponse: () => {
    let response = {
      errors: ['Field [username] is required']
    }

    return pactUsers.withPactified(response)
  },

  badRequestResponseWhenFieldsMissing: (missingFields) => {
    const responseData = _.map(missingFields, (field) => {
      return `Field [${field}] is required`
    })
    const response = {
      errors: responseData
    }

    return pactUsers.withPactified(response)
  }

}
