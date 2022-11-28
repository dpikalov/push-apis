const HPA   = require('https-proxy-agent')
const fetch = require('cross-fetch');

/**
 * HTTP/1.1 POST request. Use http-proxy agent, if env.http_proxy is set
 *
 * @param {url} url
 * @param {Object} optHeaders - optional headers
 * @param {Object|string} data
 * @return {Promise} represents {status, data}
 */
const post = async (url, optHeaders, data) => {
  const headers = {
    'Accept'      : 'application/json',
    'Content-Type': 'application/json',
    ...optHeaders,
  }

  const body = (typeof data === 'object') ?
    JSON.stringify(data): data

  const agent = process.env.http_proxy ?
    new HPA(process.env.http_proxy) : undefined;

  const resp = await fetch(url, { method: 'POST', headers, body, agent })
  const status = resp.status

  if (resp.ok) {
    return Promise.resolve({ status, data: await resp.json() })
  } else {
    return Promise.reject({ status, data: await resp.text() })
  }
}

/**/
module.exports = post
