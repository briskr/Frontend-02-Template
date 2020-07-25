const net = require('net');
/**
 * 封装 request 中包含的信息，并定义 send 函数
 */
class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.headers = options.headers || {};
    this.body = options.body || {};

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join('&');
    }

    // TODO 计算 utf-8 字节数
    this.headers['Content-Length'] = this.bodyText.length;
  }

  /**
   * 发送 request 内容，并
   */
  async send() {
    // TODO
  }
}

void (async function () {
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8088,
    path: '/',
    headers: {
      ['X-Foo1']: 'custom content',
    },
    body: {
      name: 'briskr',
      occupation: 'programmer',
    },
  });
  let response = await request.send();
  console.log(response);
})();
