const http = require('http');
const https = require('https');
const fs = require('fs');
const unzipper = require('unzipper');
const querystring = require('querystring');

// 1. 用户进入 Github App 登录页面

// 2. oAuth 服务器重定向到 /auth 路径
// 接收 code, 随后提供 code, client_id, 和 client_secret 去请求 token
// POST https://github.com/login/oauth/access_token

function auth(req, res) {
  const qs = req.url.substring('/auth?'.length);
  const query = querystring.parse(qs);
  getToken(query.code, (token) => {
    console.debug('token', token);
    res.end(`<a href="http://localhost:8083/?token=${token}">publish</a>`);
  });
}

function getToken(code, callback) {
  const client_id = 'Iv1.dcd943670036ba3a';
  const client_secret = 'bece0f4513bdb688d1ed08101cac45c426e25c6e';
  const param = {
    client_id,
    client_secret,
    code: code,
  };
  const body = querystring.stringify(param);

  const url = 'https://github.com/login/oauth/access_token';
  const req = https.request(
    url,
    {
      method: 'POST',
    },
    (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk.toString();
      });
      res.on('end', () => {
        const reply = querystring.parse(body);
        callback(reply['access_token']);
      });
    }
  );
  req.write(body);
  req.end();
}

// 3. 将 token 发回 publish-tool

// 4. publish-tool 带上 token 请求 /publish 路径
// 凭获取到的 token 获取用户信息，验证用户权限
// Authorization: token OAUTH - TOKEN
// GET https://api.github.com/user

function getUser(token, callback) {
  const req = https.request(
    {
      hostname: 'api.github.com',
      path: '/user',
      method: 'GET',
      'User-Agent': 'toy-publish-briskr',
      Authorization: `token ${token}`,
    },
    (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk.toString();
      });
      res.on('end', () => {
        console.debug(body);
        //const user = JSON.parse(body);
        // 调试时一直报 Request forbidden by administrative rules. Please make sure your request has a User-Agent header (http://developer.github.com/v3/#user-agent-required). Check https://developer.github.com for other possible causes.
        // 加上 User-Agent 也不行
        // 复制 token 用 curl 请求却能获取到用户信息
        const user = {
          login: 'briskr',
          id: 40001,
          url: 'https://api.github.com/users/briskr',
          type: 'User',
          name: 'briskr',
          created_at: '2008-12-12T07:02:41Z',
          updated_at: '2020-11-08T13:58:40Z',
        };
        if (callback) {
          callback(user);
        }
      });
    }
  );
  req.end();
}

// 验证成功则接收文件上传，验证失败直接返回

function publish(req, res) {
  // 根据客户端提供的 token ，连接 oAuth 服务器进行验证
  const auth = req.headers['authorization'];
  const token = auth.substring('token '.length);
  if (!token) {
    res.statusCode = 401;
    res.statusMessage = 'Unauthorized.';
    res.end('No token provided.');
    return;
  }

  getUser(token, (user) => {
    if (!user || user.name !== 'briskr') {
      res.statusCode = 401;
      res.statusMessage = 'Unauthorized.';
      res.end('Authorization failed.');
      return;
    }

    // 读完 request 之后再发回响应，否则 pipe 过程没结束，文件收不完整
    req.on('end', () => {
      res.end('success');
    });
    // 输出到 unzipper ，解压出包里的内容
    req.pipe(unzipper.Extract({ path: '../server/public/' }));
  });
}

http
  .createServer(function (req, res) {
    if (req.url.startsWith('/auth?')) {
      return auth(req, res);
    }
    if (req.url.startsWith('/publish')) {
      return publish(req, res);
    }
  })
  .listen(8082);
