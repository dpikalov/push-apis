# push-apis
[![npm](https://flat.badgen.net/npm/v/push-apis)](https://npmjs.com/package/push-apis)
[![npm license](https://flat.badgen.net/npm/license/push-apis)](https://npmjs.com/package/push-apis)
[![npm downloads](https://flat.badgen.net/npm/dm/push-apis)](https://npmjs.com/package/push-apis)

- Sends push-notifications via **Google/FCM**, **Huawei/Push-Kit** and **Apple** gateways

- Proxy friendly (set ```http_proxy``` env variable, if needed)

- Tunneling HTTP/2 over HTTP/1.1 proxy (Apple APIs supports HTTP/2 only)

- No dependencies on vendor libs


## Install
```npm install push-apis```

## Usage

### Google Legacy FCM API
```
const serverKey = 'AAAA...'
const payload = { notification: { title: "title", body: "body" } }
const payloadWithData = { data: { hello: "there" } }

await sendMessageFcmLegacy( serverKey, to, payload /* payloadWithData */ )
```

### Google FCM API v1
```
const gcpServiceAccount = {
  client_email: '***',
  project_id  : '***',
  private_key : '***',
  ...
}
const payload = { notification: { title: "title", body: "body" } }

await sendMessageFcmV1( serviceAccount, token, payload )
```

### Huawei Push Kit API
```
const appId = '10xxxxxxx',
const appSecret = "afxxxxxxx..."
const payload = { notification: { title: "title", body: "body" } }

await pushApi.sendMessageHuawei( appId, appSecret, token, payload )
```

### Apple Push API
```
const credentials = {
  apnsTopic: 'com.your.app.here'
  teamId: 'H4xxxxxxxx',
  keyId : '55xxxxxxxx',
  encKey: '-----BEGIN PRIVATE KEY-----\n.......'
}
const payload = { aps : { alert: { title: "title", body: "body" } } }
const payloadWithData = { hello: "there" }

await pushApi.sendMessageApple( credentials, token, payload /* payloadWithData */ )
```
