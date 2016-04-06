'use strict';

const Xml2js = require('xml2js');

module.exports = {
  name: 'intuit',
  protocol: 'oauth',
  version: '1.0',
  temporary: 'https://oauth.intuit.com/oauth/v1/get_request_token',
  auth: 'https://appcenter.intuit.com/Connect/Begin',
  token: 'https://oauth.intuit.com/oauth/v1/get_access_token',
  profile: function (credentials, params, get, callback) {
      get('https://appcenter.intuit.com/api/v1/user/current', {  }, (profile) => {
        if (!profile['<?xml version']) {
          return callback();
        }
        let xml = '<?xml version ' + profile['<?xml version'];

        Xml2js.parseString(xml, function (err, result) {
          if (err || !result.UserResponse.User || !result.UserResponse.User[0]) {
            return callback();
          }

          credentials.profile = {
            id: result.UserResponse.User[0]['$'].Id,
            email: result.UserResponse.User[0].EmailAddress[0]
          };

          return callback();
        });
      });
  }
};
