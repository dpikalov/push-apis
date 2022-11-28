const auth  = require('./lib/auth');
const post  = require('./lib/post')
const post2 = require('./lib/post-http2')

// See details:
// https://firebase.google.com/docs/cloud-messaging/send-message#send_using_the_fcm_legacy_http_api
// https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/https-send-api-0000001050986197-V5?ha_source=hms1
// https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns

/**
 * Google API legacy
 * @param {Object} payload - see FCM docs
 */
const sendMessageFcmLegacy = async (serverKey, to, payload) => {
  const url = 'https://fcm.googleapis.com/fcm/send'
  const headers = {
    'Authorization': `key=${serverKey}`,
  }
  const json = await post(url, headers, {
    to, ...payload, // direct_boot_ok: true,
  })
  return (json.failure === 0) ? json: Promise.reject(json)
}

/**
 * Google API v1
 * @param {Object} payload - see field 'message' in FCM docs
 */
const sendMessageFcmV1 = async (serviceAccount, token, payload) => {
  const url = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`
  const headers = {
    'Authorization': `Bearer ${await auth.googleAccessToken(serviceAccount)}`,
  }
  return post(url, headers, {
    message: { token, ...payload/*, android: { direct_boot_ok: true */}
  })
}

/**
 * Huawei Push Kit API
 * @param {Object} payload - see HMS-Push-Kit docs
 */
const sendMessageHuawei = async (appId, appSecret, token, payload) => {
  const url = `https://push-api.cloud.huawei.com/v1/${appId}/messages:send`
  const headers = {
    'Authorization': `Bearer ${await auth.huaweiAccessToken( appId, appSecret )}`,
  }
  const android = {
    // all messages are cached (will be delivered once the device goes online)
    collapse_key: -1,
    // message cache time
    ttl: '10000s',
  }
  // HMS data should be "JSON string" or "string"
  const data = (typeof payload.data == "object") ?
    JSON.stringify( payload.data ): payload.data

  return post( url, headers, {
    message: { token: [token], android, ...payload, data },
    validate_only: false
  })
}

/**
 * Apple API
 * @param {Object} credentials - { apnsTopic, teamId, keyId, encKey }
 * @param {Object} payload - see Apple API docs
 */
const sendMessageApple = async (credentials, token, payload ) => {
  const url = `https://api.push.apple.com/3/device/${token}`
  const { apnsTopic, teamId, keyId, encKey } = credentials

  const headers = {
    'apns-push-type': 'background',
    'apns-topic'    : apnsTopic,
    //'apns-priority': '5',
    'Authorization' : `Bearer ${await auth.appleAccessToken( teamId, keyId, encKey )}`,
  }

  if (payload?.aps?.alert != undefined) {
    headers['apns-push-type'] = 'alert'
  }

  const body = {
    aps: { 'content-available': 1 }, ...payload
  }

  // apple supports http2 only
  const { data } = await post2( url, { headers, body })

  return data;
}


/**/
module.exports = {
  sendMessageFcmLegacy, sendMessageFcmV1, sendMessageHuawei, sendMessageApple
};
