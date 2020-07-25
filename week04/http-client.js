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
        console.debug('-- response packet --');
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
 * 负责接收并解析响应内容（其中 body 部分交给 BodyParser 完成），完成后返回字符串
 */
class ResponseParser {
  /** FSM states */
  static FS = {
    WAITING_STATUS_LINE: 0,
    WAITING_STATUS_LINE_END: 1,
    WAITING_HEADER_NAME: 2,
    WAITING_HEADER_SPACE: 3,
    WAITING_HEADER_VALUE: 4,
    WAITING_HEADER_LINE_END: 5,
    WAITING_HEADER_BLOCK_END: 6,
    WAITING_BODY: 7,
  };

  constructor() {
    this.current = ResponseParser.FS.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = Object.create(null);
    this.headerName = '';
    this.headerValue = '';
  }

  /** 接收一次响应内容 */
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  /** 处理响应内容中的一个字符 */
  receiveChar(char) {
    if (this.current === ResponseParser.FS.WAITING_STATUS_LINE) {
      if (char === '\r')
        this.current = ResponseParser.FS.WAITING_STATUS_LINE_END;
      else this.statusLine += char;
    } else if (this.current === ResponseParser.FS.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = ResponseParser.FS.WAITING_HEADER_NAME;
        /* console.debug('-- Status Line --');
        console.debug(this.statusLine); */
      }
    } else if (this.current === ResponseParser.FS.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = ResponseParser.FS.WAITING_HEADER_SPACE;
      } else if (char === '\r') {
        this.current = ResponseParser.FS.WAITING_HEADER_BLOCK_END;
        // TODO 支持其他格式的 body 解析，创建不同类型的 Parser
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new ChunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === ResponseParser.FS.WAITING_HEADER_SPACE) {
      if (char === ' ') this.current = ResponseParser.FS.WAITING_HEADER_VALUE;
    } else if (this.current === ResponseParser.FS.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = ResponseParser.FS.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
      } else {
        this.headerValue += char;
      }
    } else if (this.current === ResponseParser.FS.WAITING_HEADER_LINE_END) {
      if (char === '\n') this.current = ResponseParser.FS.WAITING_HEADER_NAME;
    } else if (this.current === ResponseParser.FS.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') this.current = ResponseParser.FS.WAITING_BODY;
      /* console.debug('-- Headers finished --');
      console.debug(JSON.stringify(this.headers)); */
    } else if (this.current === ResponseParser.FS.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }

  /** 是否已完成整个结构的解析 */
  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  /** 解析完成后的 response 内容 */
  get response() {
    this.statusLine.match(/^HTTP\/1.1 ([0-9]+) ([\s\S]+)$/);
    if (!this.isFinished) {
      return null;
    }
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.result,
    };
  }
}

/** 实现 chunked 格式 body 的解析 */
class ChunkedBodyParser {
  /** FSM states */
  static FS = {
    WAITING_LENGTH: 0,
    WAITING_LENGTH_LINE_END: 1,
    READING_CHUNK: 2,
    WAITING_NEW_LINE: 3,
    WAITING_NEW_LINE_END: 4,
  };

  constructor() {
    this.length = 0;
    this.content = [];
    this.result = '';
    this.isFinished = false;
    this.current = ChunkedBodyParser.FS.WAITING_LENGTH;
  }

  receiveChar(char) {
    if (this.current === ChunkedBodyParser.FS.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = ChunkedBodyParser.FS.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16; // 前值左移一位
        this.length += parseInt(char, 16); // 加上此次读到的数字
      }
    } else if (this.current === ChunkedBodyParser.FS.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = ChunkedBodyParser.FS.READING_CHUNK;
      }
    } else if (this.current === ChunkedBodyParser.FS.READING_CHUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.current = ChunkedBodyParser.FS.WAITING_NEW_LINE;
        // 提取 content
        const chunkText = this.content.join('');
        this.result += chunkText;
        this.content = [];
      }
    } else if (this.current === ChunkedBodyParser.FS.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = ChunkedBodyParser.FS.WAITING_NEW_LINE_END;
      }
    } else if (this.current === ChunkedBodyParser.FS.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = ChunkedBodyParser.FS.WAITING_LENGTH;
      }
    }
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
  console.log('-- send() resolved, response: --');
  console.log(JSON.stringify(response));
})();
