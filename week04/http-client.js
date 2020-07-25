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

  /** 按照 HTTP 协议格式构造请求 */
  toString() {
    let lines = [
      `${this.method} ${this.path} HTTP/1.1`,
      `Host: ${this.host}`,
      ...Object.getOwnPropertyNames(this.headers).map(
        (key) => `${key}: ${this.headers[key]}`
      ),
      '',
      this.bodyText,
    ];
    const result = lines.join('\r\n');
    console.debug('-- request.toString() result --');
    console.debug(result);
    return result;
  }

  /**
   * 发送 request 内容，并
   */
  async send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();

      if (!connection) {
        connection = net.createConnection(this.port, this.host);
      }
      connection.write(this.toString());
      console.debug('-- request sent --');

      // read data from connection, send to parser
      connection.on('data', (data) => {
        console.debug('-- response chunk --');
        console.debug(data.toString());
        parser.receive(data.toString());

        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      });

      connection.on('error', (err) => {
        console.debug('onError', err);
        reject(err);
        connection.end();
      });
    });
  }
}

/**
 * 负责接收并解析响应内容，完成后返回字符串
 */
class ResponseParser {
  constructor() {}

  /** 接收一次响应内容 */
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  /** 处理响应内容中的一个字符 */
  receiveChar(char) {
    //
  }

  /** 是否已完成整个结构的解析 */
  get isFinished() {
    return true;
  }

  /** 解析完成后的 response 内容 */
  get response() {
    return 'response';
  }
}

/**
 * 执行一次 HTTP 请求并解析响应内容
 */
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
