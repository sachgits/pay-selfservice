'use strict'

const qs = require('qs')
const check = require('check-types')
const Paginator = require('../utils/paginator.js')
const states = require('../utils/states')
const _ = require('lodash')

function validateFilters (filters) {
  let pageSizeIsNull = !check.assigned(filters.pageSize)
  let pageSizeInRange = check.inRange(Number(filters.pageSize), 1, Paginator.MAX_PAGE_SIZE)
  let pageIsNull = !check.assigned(filters.page)
  let pageIsPositive = check.positive(Number(filters.page))
  return (pageSizeIsNull || pageSizeInRange) &&
    (pageIsNull || pageIsPositive)
}

function getFilters (req) {
  let filters = qs.parse(req.query)
  filters.selectedStates = []
  if (filters.state) {
    filters.selectedStates = typeof filters.state === 'string' ? [filters.state] : filters.state
    const result = states.displayStatesToConnectorStates(filters.selectedStates)
    filters.payment_states = result.payment_states
    filters.refund_states = result.refund_states
  }
  filters = _.omitBy(filters, _.isEmpty)
  return {
    valid: validateFilters(filters),
    result: filters
  }
}

function describeFilters (filters) {
  let description = ``
  if (filters.fromDate) description += ` from <strong>${filters.fromDate}</strong>`
  if (filters.toDate) description += ` to <strong>${filters.toDate}</strong>`

  const selectedStates = filters.selectedStates || []
  if (filters.state && filters.selectedStates.length === 0) {
    description += ` with <strong>${filters.state}</strong> state`
  } else if (selectedStates.length === 1) {
    description += ` with <strong>${selectedStates[0]}</strong> state`
  } else if (selectedStates.length > 1) {
    description += ` with <strong>${selectedStates.join('</strong>, <strong>').replace(/,([^,]*)$/, ' or$1')}</strong> states`
  }

  const brandStates = Array.isArray(filters.brand) ? filters.brand.map(brand => brand.replace('-', ' ')) : []
  if (brandStates.length === 0 && filters.brand) {
    description += ` with <strong class="capitalize">‘${filters.brand.replace('-', ' ')}’</strong> card brand`
  } else if (brandStates.length > 1) {
    description += ` with <strong class="capitalize">‘${brandStates.join('</strong>, <strong class="capitalize">').replace(/,([^,]*)$/, ' or$1')}’</strong> card brands`
  }

  return description
}

function old_describeFilters (filters) { // eslint-disable-line
  let description = ``
  if (filters.fromDate) description += ` from <strong>${filters.fromDate}</strong>`
  if (filters.toDate) description += ` to <strong>${filters.toDate}</strong>`

  const paymentStates = filters.payment_states ? filters.payment_states.map(state => state.charAt(0).toUpperCase() + state.slice(1)) : []
  const refundStates = filters.refund_states ? filters.refund_states.map(state => `Refund ${state}`) : []
  const selectedStates = [...paymentStates, ...refundStates].map(state => `${state}`)
  if (filters.state && selectedStates.length === 0) {
    description += ` with a payment status of <strong>${filters.state}</strong>`
  } else if (selectedStates.length === 1) {
    description += ` with a payment status of <strong>${selectedStates[0]}</strong>`
  } else if (selectedStates.length > 1) {
    description += ` with a payment status of <strong>${selectedStates.join('</strong>, <strong>').replace(/,([^,]*)$/, ' or$1')}</strong>`
  }

  const brandStates = Array.isArray(filters.brand) ? filters.brand.map(brand => brand.replace('-', ' ')) : []
  if (brandStates.length === 0 && filters.brand) {
    description += ` with <strong class="capitalize">‘${filters.brand.replace('-', ' ')}’</strong> card brand`
  } else if (brandStates.length > 1) {
    description += ` with <strong class="capitalize">‘${brandStates.join('</strong>, <strong class="capitalize">').replace(/,([^,]*)$/, ' or$1')}’</strong> card brands`
  }

  return description
}

function old_getFilters (req) { // eslint-disable-line
  let filters = qs.parse(req.query)

  if (filters.state) {
    const queryStates = typeof filters.state === 'string' ? [filters.state] : filters.state
    filters.payment_states = queryStates.filter(state => !state.includes('refund-')).map(state => state.replace('payment-', ''))
    filters.refund_states = queryStates.filter(state => state.includes('refund-')).map(state => state.replace('refund-', ''))
  }
  filters = _.omitBy(filters, _.isEmpty)
  return {
    valid: validateFilters(filters),
    result: filters
  }
}

module.exports = {
  old_getFilters: old_getFilters, // eslint-disable-line
  old_describeFilters: old_describeFilters, // eslint-disable-line
  getFilters: getFilters,
  describeFilters: describeFilters
}
