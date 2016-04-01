'use strict';

module.exports = {
  name: 'intuit',
  protocol: 'oauth',
  temporary: 'https://oauth.intuit.com/oauth/v1/get_request_token',
  auth: 'https://appcenter.intuit.com/Connect/Begin',
  token: 'https://oauth.intuit.com/oauth/v1/get_access_token',
  profile: function (credentials, params, get, callback) {
    credentials.profile = {
      realmId: params.realmId
    };

    return callback();
  }
};
