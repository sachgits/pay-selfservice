const sinon = require('sinon')
const {expect} = require('chai')
const resolveService = require('../../../app/middleware/resolve_service')
const userFixtures = require('../../fixtures/user_fixtures')

describe('resolve service', function () {
  it('resolve service from path param', function () {
    const res = {render: sinon.spy()}
    const nextSpy = sinon.spy()

    const user = userFixtures.validUser().getAsObject()
    const req = {user: user, params: {externalServiceId: user.serviceRoles[0].service.externalId}}

    resolveService(req, res, nextSpy)

    expect(req.service).to.deep.equal(user.serviceRoles[0].service)
    expect(nextSpy.called).to.equal(true)
  })

  it('service.hasDirectDebitGatewayAccount is true and service.hasCardGatewayAccount is false when we have Direct Debit gateway accounts only', function () {
    const res = {render: sinon.spy()}
    const nextSpy = sinon.spy()

    const user = userFixtures.validUser({
      gateway_account_ids: ['DIRECT_DEBIT:randomidhere']
    }).getAsObject()
    const req = {user: user, params: {externalServiceId: user.serviceRoles[0].service.externalId}}

    resolveService(req, res, nextSpy)

    expect(req.service.hasDirectDebitGatewayAccount).to.be.equal(true)
    expect(req.service.hasCardGatewayAccount).to.be.equal(false)
    expect(req.service.hasCardAndDirectDebitGatewayAccount).to.be.equal(false)
    expect(nextSpy.called).to.equal(true)
  })

  it('service.hasCardGatewayAccount is true and service.hasDirectDebitGatewayAccount is false when we have Card gateway accounts only', function () {
    const res = {render: sinon.spy()}
    const nextSpy = sinon.spy()

    const user = userFixtures.validUser({
      gateway_account_ids: ['7127217']
    }).getAsObject()
    const req = {user: user, params: {externalServiceId: user.serviceRoles[0].service.externalId}}

    resolveService(req, res, nextSpy)

    expect(req.service.hasCardGatewayAccount).to.be.equal(true)
    expect(req.service.hasDirectDebitGatewayAccount).to.be.equal(false)
    expect(req.service.hasCardAndDirectDebitGatewayAccount).to.be.equal(false)
    expect(nextSpy.called).to.equal(true)
  })

  it('service.hasCardAndDirectDebitGatewayAccount is true when we have Direct Debit and Card gateway accounts', function () {
    const res = {render: sinon.spy()}
    const nextSpy = sinon.spy()

    const user = userFixtures.validUser({
      gateway_account_ids: ['7127217', 'DIRECT_DEBIT:randomidhere']
    }).getAsObject()
    const req = {user: user, params: {externalServiceId: user.serviceRoles[0].service.externalId}}

    resolveService(req, res, nextSpy)

    expect(req.service.hasCardAndDirectDebitGatewayAccount).to.be.equal(true)
    expect(req.service.hasCardGatewayAccount).to.be.equal(false)
    expect(req.service.hasDirectDebitGatewayAccount).to.be.equal(false)
    expect(nextSpy.called).to.equal(true)
  })
})
