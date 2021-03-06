'use strict'
const pactBase = require('./pact_base')

// Global setup
const pactProducts = pactBase()

module.exports = {
  pactifyRandomData: (opts = {}) => {
    pactProducts.pactify(opts)
  },

  validUpdateServiceNameOfProductsByGatewayAccountIdRequest: (serviceName) => {
    const data = {
      op: 'replace',
      path: 'service_name',
      value: serviceName || 'New Service Name'
    }
    return {
      getPactified: () => {
        return pactProducts.pactify(data)
      },
      getPlain: () => data
    }
  },

  invalidUpdateServiceNameOfProductsByGatewayAccountIdRequest: () => {
    const data = {
      op: 'replace',
      path: 'service_name'
    }
    return {
      getPactified: () => {
        return pactProducts.pactify(data)
      },
      getPlain: () => data
    }
  },

  validCreateProductRequest: (opts = {}) => {
    const data = {
      gateway_account_id: opts.gatewayAccountId || 'd5gzn',
      pay_api_token: opts.payApiToken || 'pay-api-token',
      name: opts.name || 'A Product Name',
      service_name: opts.serviceName || 'Example Service',
      type: opts.type || 'DEMO'
    }
    if (opts.type === 'ADHOC') data.reference_enabled = opts.reference_enabled || false
    if (opts.description) data.description = opts.description
    if (opts.returnUrl) data.return_url = opts.returnUrl
    if (opts.price) data.price = opts.price
    if (opts.service_name_path) data.service_name_path = opts.service_name_path
    if (opts.product_name_path) data.product_name_path = opts.product_name_path
    if (opts.reference_enabled) {
      data.reference_label = opts.reference_label
      data.reference_hint = opts.reference_hint
    }
    return {
      getPactified: () => {
        return pactProducts.pactify(data)
      },
      getPlain: () => {
        return data
      }
    }
  },

  validCreatePaymentResponse: (opts = {}) => {
    const data = {
      external_id: opts.external_id || 'b9tijg',
      product_external_id: opts.product_external_id || 'mekna7',
      next_url: opts.next_url || `http://service.url/next`,
      status: opts.status || 'CREATED',
      govuk_status: opts.govuk_status || 'success',
      _links: opts.links
    }
    if (!data._links) {
      data._links = [{
        href: `http://products.url/v1/api/payments/${(data.external_id)}`,
        rel: 'self',
        method: 'GET'
      }, {
        href: `http://frontend.url/charges/${(data.external_id)}`,
        rel: 'next',
        method: 'POST'
      }]
    }

    return {
      getPactified: () => {
        return pactProducts.pactify(data)
      },
      getPlain: () => {
        return data
      }
    }
  },

  validCreateProductResponse: (opts = {}) => {
    const data = {
      external_id: opts.external_id || 'cf3hp2',
      type: opts.type || 'DEMO',
      gateway_account_id: opts.gateway_account_id || 'xr9nkd',
      name: opts.name || 'A Product Name',
      service_name: opts.serviceName || 'Example Service',
      _links: opts.links
    }

    if (opts.description) data.description = opts.description
    if (opts.return_url) data.return_url = opts.return_url
    if (opts.price) data.price = opts.price
    if (opts.service_name_path) data.service_name_path = opts.service_name_path
    if (opts.product_name_path) data.product_name_path = opts.product_name_path
    if (!data._links) {
      data._links = [{
        href: `http://products.url/v1/api/products/${data.external_id}`,
        rel: 'self',
        method: 'GET'
      }, {
        href: `http://products-ui.url/pay/${data.external_id}`,
        rel: 'pay',
        method: 'GET'
      }]
      if (opts.service_name_path && opts.product_name_path) {
        data._links.push({
          href: `http://products-ui.url/redirect/${opts.service_name_path}/${opts.product_name_path}`,
          rel: 'friendly',
          method: 'GET'
        })
      }
    }

    return {
      getPactified: () => {
        return pactProducts.pactify(data)
      },
      getPlain: () => {
        return data
      }
    }
  },

  validGetProductByPath: (opts = {}) => {
    const data = {
      serviceNamePath: opts.serviceNamePath || 'service-name',
      productNamePath: opts.productNamePath || 'product-name'
    }
    return {
      getPactified: () => {
        return pactProducts.pactify(data)
      },
      getPlain: () => {
        return data
      }
    }
  }
}
