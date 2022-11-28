# push-apis

Sends push-notifications via Google/FCM, Huawei/Push-Kit, Apple

Proxy friendly. HTTP2-over-HTTP1.1-proxy tunneling (as Apple APIs supports HTTP/2 only)

No dependencies on vendor libs


## Features
- The implementation based on REST APIs only, no vendor libs.

- Supports proxy (HTTP/2 enabled for Apple APIs only)

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
