const path = require('path')
const nock = require('nock')
const session = require(path.join(__dirname, '/../test_helpers/mock_session.js'))
const getApp = require(path.join(__dirname, '/../../server.js')).getApp
const supertest = require('supertest')
const serviceFixtures = require(path.join(__dirname, '/../fixtures/service_fixtures'))
const userFixtures = require(path.join(__dirname, '/../fixtures/user_fixtures'))
const paths = require(path.join(__dirname, '/../../app/paths.js'))
const csrf = require('csrf')
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const adminusersMock = nock(process.env.ADMINUSERS_URL)
const SERVICE_RESOURCE = '/v1/api/services'
const INVITE_RESOURCE = '/v1/api/invites'
const USER_RESOURCE = '/v1/api/users'

let app
chai.use(chaiAsPromised)

const formattedPathFor = require('../../app/utils/replace_params_in_path')

describe('service users resource', function () {
  let EXTERNAL_ID_LOGGED_IN = '7d19aff33f8948deb97ed16b2912dcd3'
  let USERNAME_LOGGED_IN = 'existing-user@example.com'
  let EXTERNAL_ID_OTHER_USER = '393266e872594f1593558549caad95ec'
  let USERNAME_OTHER_USER = 'other-user@example.com'

  afterEach((done) => {
    nock.cleanAll()
    app = null
    done()
  })

  it('get list of service users should link to my profile for my user', function (done) {
    const externalServiceId = '734rgw76jhka'
    const serviceRoles = [{
      service: {
        name: 'System Generated',
        external_id: externalServiceId
      },
      role: {name: 'admin', description: 'Administrator', permissions: [{name: 'users-service:create'}]}
    }]
    const user = session.getUser({
      external_id: EXTERNAL_ID_LOGGED_IN,
      username: USERNAME_LOGGED_IN,
      email: USERNAME_LOGGED_IN,
      service_roles: serviceRoles
    })

    const serviceUsersRes = serviceFixtures.validServiceUsersResponse([{service_roles: serviceRoles}])
    const getInvitesRes = serviceFixtures.validListInvitesForServiceResponse()

    adminusersMock.get(`${SERVICE_RESOURCE}/${externalServiceId}/users`)
      .reply(200, serviceUsersRes.getPlain())
    adminusersMock.get(`${INVITE_RESOURCE}?serviceId=${externalServiceId}`)
      .reply(200, getInvitesRes.getPlain())
    app = session.getAppWithLoggedInUser(getApp(), user)

    supertest(app)
      .get(formattedPathFor(paths.teamMembers.index, externalServiceId))
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.number_active_members).to.equal(1)
        expect(res.body.number_admin_members).to.equal(1)
        expect(res.body['number_view-only_members']).to.equal(0)
        expect(res.body['number_view-and-refund_members']).to.equal(0)
        expect(res.body.team_members.admin.length).to.equal(1)
        expect(res.body.team_members.admin[0].username).to.equal(USERNAME_LOGGED_IN)
        expect(res.body.team_members.admin[0].link).to.equal('/my-profile')
        expect(res.body.team_members.admin[0].is_current).to.equal(true)
        expect(res.body.team_members['view-only'].length).to.equal(0)
        expect(res.body.team_members['view-and-refund'].length).to.equal(0)
      })
      .end(done)
  })

  it('get list of service users should link to a users view details for other users', function (done) {
    const externalServiceId = '734rgw76jhka'

    const serviceRoles = [{
      service: {
        name: 'System Generated',
        external_id: externalServiceId
      },
      role: {name: 'admin', description: 'Administrator', permissions: [{name: 'users-service:create'}]}
    }]
    const user = session.getUser({
      external_id: EXTERNAL_ID_LOGGED_IN,
      username: USERNAME_LOGGED_IN,
      email: USERNAME_LOGGED_IN + '@example.com',
      service_roles: serviceRoles
    })

    const serviceUsersRes = serviceFixtures.validServiceUsersResponse([{
      service_roles: serviceRoles
    }, {
      external_id: EXTERNAL_ID_OTHER_USER,
      service_roles: serviceRoles
    }])
    const getInvitesRes = serviceFixtures.validListInvitesForServiceResponse()

    adminusersMock.get(`${SERVICE_RESOURCE}/${externalServiceId}/users`)
      .reply(200, serviceUsersRes.getPlain())
    adminusersMock.get(`${INVITE_RESOURCE}?serviceId=${externalServiceId}`)
      .reply(200, getInvitesRes.getPlain())
    app = session.getAppWithLoggedInUser(getApp(), user)

    supertest(app)
      .get(formattedPathFor(paths.teamMembers.index, externalServiceId))
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.team_members.admin[1].link).to.equal(formattedPathFor(paths.teamMembers.show, externalServiceId, EXTERNAL_ID_OTHER_USER))
      })
      .end(done)
  })

  it('view team member details', function (done) {
    const externalServiceId = '734rgw76jhka'
    const userInSession = session.getUser({
      external_id: EXTERNAL_ID_LOGGED_IN,
      username: USERNAME_LOGGED_IN,
      email: USERNAME_LOGGED_IN,
      service_roles: [{
        service: {
          name: 'System Generated',
          external_id: externalServiceId
        },
        role: {name: 'admin', description: 'Administrator', permissions: [{name: 'users-service:read'}]}
      }]
    })

    const userToView = {
      external_id: EXTERNAL_ID_OTHER_USER,
      username: USERNAME_OTHER_USER,
      email: USERNAME_OTHER_USER,
      service_roles: [{
        service: {
          name: 'System Generated',
          external_id: externalServiceId
        },
        role: {name: 'view-only', description: 'View only'}
      }]
    }
    const getUserResponse = userFixtures.validUserResponse(userToView)

    adminusersMock.get(`${USER_RESOURCE}/${EXTERNAL_ID_OTHER_USER}`)
      .reply(200, getUserResponse.getPlain())

    app = session.getAppWithLoggedInUser(getApp(), userInSession)

    supertest(app)
      .get(formattedPathFor(paths.teamMembers.show, externalServiceId, EXTERNAL_ID_OTHER_USER))
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.username).to.equal(USERNAME_OTHER_USER)
        expect(res.body.email).to.equal('other-user@example.com')
        expect(res.body.role).to.equal('View only')
        expect(res.body.editPermissionsLink).to.equal(formattedPathFor(paths.teamMembers.permissions, externalServiceId, EXTERNAL_ID_OTHER_USER))
        expect(res.body.removeTeamMemberLink).to.equal(formattedPathFor(paths.teamMembers.delete, externalServiceId, EXTERNAL_ID_OTHER_USER))
      })
      .end(done)
  })

  it('should show my profile', function (done) {
    const user = {
      external_id: EXTERNAL_ID_LOGGED_IN,
      username: USERNAME_LOGGED_IN,
      email: USERNAME_LOGGED_IN,
      telephone_number: '+447876548778',
      // TODO: fix to use serviceRoles
      services: [{
        name: 'System Generated',
        external_id: '8348754ihuwk'
      }]
    }
    const userInSession = session.getUser(user)
    const getUserResponse = userFixtures.validUserResponse(user)

    adminusersMock.get(`${USER_RESOURCE}/${EXTERNAL_ID_LOGGED_IN}`)
      .reply(200, getUserResponse.getPlain())

    app = session.getAppWithLoggedInUser(getApp(), userInSession)

    supertest(app)
      .get('/my-profile')
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.username).to.equal(user.username)
        expect(res.body.email).to.equal(user.email)
        expect(res.body['telephone_number']).to.equal(user.telephone_number)
      })
      .end(done)
  })

  it('should not show my profile without second factor', function (done) {
    const user = {
      external_id: EXTERNAL_ID_LOGGED_IN,
      username: USERNAME_LOGGED_IN,
      email: USERNAME_LOGGED_IN + '@example.com',
      telephone_number: '+447876548778',
      // TODO: fix to use serviceRoles
      services: [{
        name: 'System Generated',
        external_id: '3894hewfui'
      }]
    }
    const userInSession = session.getUser(user)
    const getUserResponse = userFixtures.validUserResponse(user)

    adminusersMock.get(`${USER_RESOURCE}/${EXTERNAL_ID_LOGGED_IN}`)
      .reply(200, getUserResponse.getPlain())

    app = session.getAppWithSessionWithoutSecondFactor(getApp(), userInSession)

    supertest(app)
      .get('/my-profile')
      .set('Accept', 'application/json')
      .expect(302)
      .expect('Location', '/otp-login')
      .end(done)
  })

  it('should redirect to my profile when trying to access my user through team members path', function (done) {
    const userInSession = session.getUser({
      permissions: [{name: 'users-service:read'}]
    })
    const externalServiceId = userInSession.serviceRoles[0].service.externalId
    EXTERNAL_ID_LOGGED_IN = userInSession.externalId

    app = session.getAppWithLoggedInUser(getApp(), userInSession)

    supertest(app)
      .get(formattedPathFor(paths.teamMembers.show, externalServiceId, EXTERNAL_ID_LOGGED_IN))
      .set('Accept', 'application/json')
      .expect(302)
      .expect('Location', '/my-profile')
      .end(done)
  })

  it('error when accessing an user from other service profile (cheeky!)', function (done) {
    const externalServiceId1 = '48753g874tg'
    const externalServiceId2 = '7huh4y7tu6g'
    const user = session.getUser({
      external_id: EXTERNAL_ID_LOGGED_IN,
      username: USERNAME_LOGGED_IN,
      email: USERNAME_LOGGED_IN + '@example.com',
      service_roles: [{
        service: {
          name: 'System Generated',
          external_id: externalServiceId1
        },
        role: {name: 'admin', description: 'Administrator', permissions: [{name: 'users-service:read'}]}
      }]
    })
    const getUserResponse = userFixtures.validUserResponse({
      external_id: EXTERNAL_ID_OTHER_USER,
      username: USERNAME_OTHER_USER,
      service_roles: [{
        service: {
          name: 'System Generated',
          external_id: externalServiceId2
        },
        role: {name: 'view-only', description: 'View only', permissions: [{name: 'users-service:read'}]}
      }],
      // TODO: fix to use serviceRoles

      services: [{
        name: 'System Generated',
        external_id: externalServiceId2
      }]
    })

    adminusersMock.get(`${USER_RESOURCE}/${EXTERNAL_ID_OTHER_USER}`)
      .reply(200, getUserResponse.getPlain())

    app = session.getAppWithLoggedInUser(getApp(), user)

    supertest(app)
      .get(formattedPathFor(paths.teamMembers.show, externalServiceId2, EXTERNAL_ID_OTHER_USER))
      .set('Accept', 'application/json')
      .expect(500)
      .expect((res) => {
        expect(res.body.message).to.equal('You do not have the rights to access this service.')
      })
      .end(done)
  })

  it('remove a team member successfully should redirect user to team member', function (done) {
    let userInSession = session.getUser({
      permissions: [{name: 'users-service:delete'}]
    })
    const externalServiceId = userInSession.serviceRoles[0].service.externalId
    EXTERNAL_ID_LOGGED_IN = userInSession.externalId

    let userToDelete = {
      external_id: EXTERNAL_ID_OTHER_USER,
      username: USERNAME_OTHER_USER,
      role: {'name': 'view-only'}
    }

    let getUserResponse = userFixtures.validUserResponse(userToDelete)

    adminusersMock.get(`${USER_RESOURCE}/${EXTERNAL_ID_OTHER_USER}`)
      .reply(200, getUserResponse.getPlain())

    adminusersMock.delete(`${SERVICE_RESOURCE}/${externalServiceId}/users/${EXTERNAL_ID_OTHER_USER}`)
      .reply(200)

    app = session.getAppWithLoggedInUser(getApp(), userInSession)

    supertest(app)
      .post(formattedPathFor(paths.teamMembers.delete, externalServiceId, EXTERNAL_ID_OTHER_USER))
      .send({csrfToken: csrf().create('123')})
      .expect(302)
      .expect('Location', formattedPathFor(paths.teamMembers.index, externalServiceId))
      .end(done)
  })

  it('when remove a team member fails when user does not exist should redirect user to error view with link to view team members', function (done) {
    let userInSession = session.getUser({
      permissions: [{name: 'users-service:delete'}]
    })

    const externalServiceId = userInSession.serviceRoles[0].service.externalId
    EXTERNAL_ID_LOGGED_IN = userInSession.externalId

    adminusersMock.get(`${USER_RESOURCE}/${EXTERNAL_ID_OTHER_USER}`)
      .reply(404)

    app = session.getAppWithLoggedInUser(getApp(), userInSession)

    supertest(app)
      .post(formattedPathFor(paths.teamMembers.delete, externalServiceId, EXTERNAL_ID_OTHER_USER))
      .set('Accept', 'application/json')
      .send({csrfToken: csrf().create('123')})
      .expect(200)
      .expect((res) => {
        expect(res.body.error.title).to.equal('This person has already been removed')
        expect(res.body.error.message).to.equal('This person has already been removed by another administrator.')
        expect(res.body.link.link).to.equal(`/service/${externalServiceId}`)
        expect(res.body.link.text).to.equal('View all team members')
        expect(res.body.enable_link).to.equal(true)
      })
      .end(done)
  })

  it('get list of invited users', function (done) {
    const externalServiceId = '734rgw76jhka'
    const serviceRoles = [{
      service: {
        name: 'System Generated',
        external_id: externalServiceId
      },
      role: {name: 'admin', description: 'Administrator', permissions: [{name: 'users-service:create'}]}
    }]
    const user = session.getUser({
      external_id: EXTERNAL_ID_LOGGED_IN,
      username: USERNAME_LOGGED_IN,
      email: USERNAME_LOGGED_IN,
      service_roles: serviceRoles
    })
    const FIRST_EMAIL = 'esdfkjh@email.test'
    const SECOND_EMAIL = 'esdfkjh2@email.test'
    const invites = [{
      email: FIRST_EMAIL,
      telephone_number: '',
      disabled: false,
      role: 'admin',
      expired: false,
      user_exist: false,
      attempt_counter: 0
    }, {
      email: SECOND_EMAIL,
      telephone_number: '',
      disabled: false,
      role: 'view-only',
      expired: false,
      user_exist: false,
      attempt_counter: 0
    }]
    const serviceUsersRes = serviceFixtures.validServiceUsersResponse([{service_roles: serviceRoles}])
    const getInvitesRes = serviceFixtures.validListInvitesForServiceResponse(invites)

    adminusersMock.get(`${SERVICE_RESOURCE}/${externalServiceId}/users`)
      .reply(200, serviceUsersRes.getPlain())
    adminusersMock.get(`${INVITE_RESOURCE}?serviceId=${externalServiceId}`)
      .reply(200, getInvitesRes.getPlain())
    app = session.getAppWithLoggedInUser(getApp(), user)

    supertest(app)
      .get(formattedPathFor(paths.teamMembers.index, externalServiceId))
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.number_invited_members).to.equal(2)
        expect(res.body.number_admin_invited_members).to.equal(1)
        expect(res.body['number_view-only_invited_members']).to.equal(1)
        expect(res.body['number_view-and-refund_invited_members']).to.equal(0)
        expect(res.body.invited_team_members.admin.length).to.equal(1)
        expect(res.body.invited_team_members.admin[0].username).to.equal(FIRST_EMAIL)
        expect(res.body.invited_team_members['view-only'].length).to.equal(1)
        expect(res.body.invited_team_members['view-only'][0].username).to.equal(SECOND_EMAIL)
        expect(res.body.invited_team_members['view-and-refund'].length).to.equal(0)
      })
      .end(done)
  })
})
