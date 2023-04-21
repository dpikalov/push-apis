const jws   = require('jws');
const post  = require('./post')
const post2 = require('./post-http2')

/**
 * Request Google access-token for given service-account
 * @returns {string}
 */
const googleAccessToken = async (serviceAccount) => {
  const header = { alg: 'RS256' }
  const payload= {
    iss  : serviceAccount.client_email,
    aud  : 'https://www.googleapis.com/oauth2/v4/token',
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    iat  : Math.floor(Date.now() / 1000),
    exp  : Math.floor(Date.now() / 1000) + 60, // 60 sec
  }
  const json = await post(payload.aud, {}, {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion :  await jws.sign({ header, payload, secret: serviceAccount.private_key })
  })
  return json.data.access_token
}

/**
 * Generate Apple access-token
 * @returns {string}
 */
const appleAccessToken = async (teamId, keyId, secret) => {
  const header = {
    alg: 'ES256',
    kid: keyId,
  }
  const payload= {
    iss: teamId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60, // 60 sec
  }
  return jws.sign({ header, payload, secret })
}

/**
 * Request HMS access-token for given huawei-app
 * @returns {string}
 */
const huaweiAccessToken = async (appId, appSecret) => {
  const url = 'https://oauth-login.cloud.huawei.com/oauth2/v2/token'
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  }

  const data = new URLSearchParams({
    grant_type   : 'client_credentials',
    client_id    : appId,
    client_secret: appSecret,
  })

  const json = await post(url, headers, data.toString())
  return json.data.access_token
}

/**/
module.exports = {
  googleAccessToken, huaweiAccessToken, appleAccessToken
};
