const index = require('./index')

describe('push-api', () => {

  test('google-api is reachable, returns auth error', async () => {
    const serverKey = 'AAAA'
    const to = 'xxxx'
    const payload = { data: {} }
    try {
      await index.sendMessageFcmLegacy( serverKey, to, payload )
    } catch (e) {
      expect(e.status).toEqual(401)
    }
  })

  test('huawei-api is reachable, returns auth error', async () => {
    const appId = '111111111'
    const appSecret = '222222222'
    const token = 'xxxx'
    const payload = { data: {} }
    try {
      await index.sendMessageHuawei( appId, appSecret, token, payload )
    } catch (e) {
      expect(e.status).toEqual(400)
    }
  })

  test('apple-api is reachable, returns auth error', async () => {
    const credentials = {
      "server": "api.sandbox.push.apple.com",
      "apnsTopic": "fake.topic.for.test",
      "teamId": "1111111111",
      "keyId" : "2222222222",
      "encKey": "-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEINm+z+k/gl7IGnG6ozSpDcpPQnXb26sKNEM7Zs5QKyJMoAcGBSuBBAAK\noUQDQgAECHc/XPdjSkSYXOjFXlPiNdwrfTLPF0dMexgofzY6O+3gOYYoZpfkMHqh\n3JiWmcR7vktWWwpODx7z8/VTOjPjoQ==\n-----END EC PRIVATE KEY-----",
    }
    const token = 'xxxxxx'
    const payload = { data: {} }
    try {
      await index.sendMessageApple(credentials, token, payload )
    } catch (e) {
      expect(e.status).toEqual(403)
      expect(e.data).toEqual('{"reason":"InvalidProviderToken"}')
    }
  })

})
