'use strict';

// Load modules

const Bell = require('bell');
const Code = require('code');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Lab = require('lab');
const Mock = require('bell/test/mock');
const Intuit = require('../');


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('intuit', () => {
  it('authenticates with mock', { parallel: false }, (done) => {
    const mock = new Mock.V1();
    mock.start((provider) => {
      const server = new Hapi.Server();
      server.connection({ host: 'localhost', port: 80 });
      server.register(Bell, (err) => {
        expect(err).to.not.exist();

        Hoek.merge(Intuit, provider);

        server.auth.strategy('intuit', 'bell', {
          password: 'cookie_encryption_password_secure',
          isSecure: false,
          clientId: 'intuit',
          clientSecret: 'secret',
          provider: Intuit
        });

        server.route({
          method: '*',
          path: '/login',
          config: {
            auth: 'intuit',
            handler: function (request, reply) {
              reply(request.auth.credentials);
            }
          }
        });

        server.inject('/login', (res) => {
          const cookie = res.headers['set-cookie'][0].split(';')[0] + ';';
          mock.server.inject(res.headers.location, (mockRes) => {
            server.inject({ url: mockRes.headers.location, headers: { cookie: cookie } }, (response) => {
              expect(response.result.provider).to.equal('intuit');
              expect(response.result.token).to.equal('final');
              expect(response.result.secret).to.equal('secret');
              mock.stop(done);
            });
          });
        });
      });
    });
  });
});
