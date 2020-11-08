const http = require('http');
const fs = require('fs');
const archiver = require('archiver');
const childProcess = require('child_process');
const querystring = require('querystring');

// 1. 打开登录页面 https://github.com/login/oauth/authorize?client_id=<Client ID>

const client_id = 'Iv1.dcd943670036ba3a';
childProcess.exec(`start https://github.com/login/oauth/authorize?client_id=${client_id}`);

// 2. publish-server 端处理 auth

// 3. 创建一个 server 接收 auth 验证之后得到的 token, 在后续请求中添加

const server = http
  .createServer(function (req, res) {
    const query = querystring.parse(req.url.substring('/?'.length));
    publish(query.token);
    server.close();
  })
  .listen(8083);

function publish(token) {
  const request = http.request(
    {
      //hostname: 'box',
      hostname: 'localhost',
      path: '/publish',
      port: 8082,
      method: 'POST',
      headers: {
        //'Content-Type': 'application/octet-stream',
        Authorization: `token ${token}`,
        'Content-Type': 'application/zip',
        //'Content-Length': stats.size,
      },
    },
    (res) => {
      console.debug('response status:\n' + res.statusCode);
      res.on('data', (chunk) => {
        console.debug(chunk.toString());
      });
    }
  );

  // 压缩目录内容，作为 readable 流
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });
  archive.directory('./dist/', false);
  archive.finalize();

  //archive.pipe(fs.createWriteStream('tmp.zip'));

  archive.pipe(request);

  //});
}
