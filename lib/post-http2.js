const http = require('http');
const http2= require('http2');

// Establish tunnel connection over HTTP/1.1 proxy
// @returns {Promise} represents tls.TLSSocket
const tunnel = (origin, proxy) => new Promise((done, fail) => {
  const { username, password } = new URL(proxy)
  const proxyAuth = Buffer.from(`${username}:${password}`).toString('base64')

  const { host, port } = new URL(origin)
  const method = 'CONNECT'
  const path   = `${host}:${port}`
  const headers= { 'proxy-authorization': `Basic ${proxyAuth}` }
  const req = http.request( proxy, { method, path, headers } ).end()

  req.on('error', fail)

  req.on('connect', (res, socket) => {
    const status = res.statusCode;
    const message= res.statusMessage;
    (status == 200) ? done( socket ): fail({ status, message });
  })
})

// @returns {Promise} represents ClientHttp2Session
const connect = async (origin, proxy) => {
  const socket = proxy ? ( await tunnel(origin, proxy) ): undefined
  return http2.connect( origin, { socket });
}

// @returns {Promise} represents response as { status, data }
const request = (session, pathname, options) => new Promise((done, fail) => {
  const { method, headers, body } = options

  const data = (typeof body === 'object') ?
    JSON.stringify( body ): body

  const req = session.request({
    ':method': method,
    ':path'  : pathname,
    ...headers,
  })

  req.end(data)

  req.setEncoding('utf8');

  const res = { status: 0, data: ''}

  req.on('response', (headers) => res.status = headers[':status'])

  req.on('data', (chunk) => res.data += chunk)

  req.on('end', () => {
    const ok = (200 <= res.status && res.status < 400 )
    ok ? done( res ) : fail( res )
    session.close();
  });
})

/**
 * HTTP/2 POST request. Use http-proxy tunneling, if env.http_proxy is set
 *
 * @param {string} - url
 * @param {Object} - options { method, headers, body }
 * @returns {Promise} represents {status, data}
 */
const post = async (url, options) => {
  const { origin, pathname } = new URL(url)

  const session = await connect( origin, process.env.http_proxy )
  return request( session, pathname, { ...options, method:'POST' })
}

/**/
module.exports = post
