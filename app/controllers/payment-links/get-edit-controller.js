'use strict'

// NPM dependencies
const logger = require('winston')
const lodash = require('lodash')

// Local dependencies
const {response} = require('../../utils/response.js')
const paths = require('../../paths')
const productsClient = require('../../services/clients/products_client.js')
const auth = require('../../services/auth_service.js')
const errorView = require('../../utils/response.js').renderErrorView
const formattedPathFor = require('../../utils/replace_params_in_path')

module.exports = (req, res) => {
  const PAGE_PARAMS = {
    create: paths.paymentLinks.start,
    manage: paths.paymentLinks.manage,
    self: formattedPathFor(paths.paymentLinks.edit, req.params.productExternalId),
    editInformation: formattedPathFor(paths.paymentLinks.editInformation, req.params.productExternalId),
    editAmount: formattedPathFor(paths.paymentLinks.editAmount, req.params.productExternalId)
  }

  const gatewayAccountId = auth.getCurrentGatewayAccountId(req)
  productsClient.product.getByProductExternalId(gatewayAccountId, req.params.productExternalId)
    .then(product => {
      const productCheck = lodash.cloneDeep(product)
      const editPaymentLinkData = lodash.get(req, 'session.editPaymentLinkData', {})
      PAGE_PARAMS.product = lodash.merge(product, editPaymentLinkData)
      PAGE_PARAMS.changed = !lodash.isEqual(productCheck, PAGE_PARAMS.product)
      lodash.set(req, 'session.editPaymentLinkData', PAGE_PARAMS.product)
      return response(req, res, 'payment-links/edit', PAGE_PARAMS)
    })
    .catch((err) => {
      logger.error(`[requestId=${req.correlationId}] Get ADHOC product by gateway account id failed - ${err.message}`)
      errorView(req, res, 'Internal server error')
    })
}
