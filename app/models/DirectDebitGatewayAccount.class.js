'use strict'

/**
 * @class DirectDebitGatewayAccount
 * @property {string} name - The name of the gateway account
 * @property {string} id - The id of the gateway account
 * @property {string} type - The type of the gateway account (e.g. test/live)
 * @property {string} description - The description of the gateway account
 * @property {string} analyticsId - Google analyticsId of the gateway account
 * @property {boolean} externalId - external id of the gateway account
 */
class DirectDebitGatewayAccount {
  /**
   * Create an instance of Service
   * @param {Object} gatewayAccountData - raw 'gateway account' object from server
   * @param {string} gatewayAccountData.gateway_account_id - The external ID of the gateway account
   * @param {string} gatewayAccountData.service_name - The name of the gateway account
   * @param {string} gatewayAccountData.type - The type of the gateway account
   * @param {string} gatewayAccountData.payment_provider - The payment provider of the gateway account
   * @param {string} gatewayAccountData.description - The description of the gateway account
   * @param {string} gatewayAccountData.analytics_id - Google analytics_id of the gateway account
   * @param {boolean} gatewayAccountData.external_id - external id of the gateway account
   **/
  constructor (gatewayAccountData) {
    this.id = gatewayAccountData.gateway_account_id
    this.serviceName = gatewayAccountData.service_name
    this.type = gatewayAccountData.type
    this.description = gatewayAccountData.description
    this.analyticsId = gatewayAccountData.analytics_id
    this.externalId = gatewayAccountData.gateway_account_external_id

    // compatibility with other parts of selfservice - recording as tech debt in jira
    this.payment_provider = gatewayAccountData.payment_provider
    this.service_name = gatewayAccountData.service_name
  }

  /**
   * @method toJson
   * @returns {Object} A minimal representation of the gateway account
   */
  toMinimalJson () {
    return {
      id: this.id,
      external_id: this.externalId,
      payment_provider: this.paymentProvider,
      service_name: this.name,
      type: this.type
    }
  }
}

module.exports = DirectDebitGatewayAccount
